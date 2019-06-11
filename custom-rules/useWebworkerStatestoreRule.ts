import * as ts from 'typescript';
import * as Lint from 'tslint';
import { isUndefined } from 'util';

interface TextResouce {
  text: string;
  name: string;
}

// tslint:disable-next-line:use-webworker-statestore
// tslint:disable-next-line:no-global-variables
const resourceMap: TextResouce[] = [
  {
    text: 'localstorage.',
    name: 'local storage'
  },
  {
    text: 'sessionstorage.',
    name: 'session storage'
  },
  {
    text: 'window.indexeddb',
    name: 'indexed db'
  },
  {
    text: 'window.mozindexeddb',
    name: 'indexed db'
  },
  {
    text: 'window.webkitindexeddb',
    name: 'indexed db'
  },
  {
    text: 'window.msindexeddb',
    name: 'indexed db'
  },
  {
    text: 'document.cookie',
    name: 'cookie'
  }
];

const mapLength: number = resourceMap.length;

let ignoredFiles: string[];

let ignoreCurrentFile: boolean;
let checkedIgnore: boolean;

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'use-webworker-statestore',
    type: 'style',
    description: `Ensure that the SPA uses the webworker`,
    rationale: `To enforce conformity to worker design pattern`,
    options: {
        type: 'array',
        items: {
          type: 'string'
        },
        minLength: 1
    },
    optionsDescription: 'list of files to ignore',
    typescriptOnly: true,
  };

  public static FAILURE_STRING_FACTORY(invalidResource: string): string{
      return `SPA should not directly interact with ${invalidResource}, use worker or statestore instead`;
  }


  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    checkedIgnore = false;
    ignoreCurrentFile = false;
    return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
  }
}

const containsHttpImport = (text: string): boolean => {
  let containsHttp: boolean = false;
  if (text.indexOf('@angular') > -1){
    const startIndex: number = text.indexOf('{') + 1;
    const endIndex: number = text.indexOf('}');
    const imports: string[] = text.substring(startIndex, endIndex).split(', ');
    const importsLength: number = imports.length;
    for (let i: number = 0; i < importsLength; i++){
      if (imports[i].trim() === 'http'){
        containsHttp = true;
        break;
      }
    }
  }
  return containsHttp;
};

const containsInvalidReference = (node: ts.Node): string => {
  let invalidResource: string;
  const nodeText: string = node.getText().toLowerCase();
  if (node.kind === ts.SyntaxKind.ImportDeclaration
    && containsHttpImport(nodeText)){
    invalidResource = 'HTTP';
  } else if (node.kind === ts.SyntaxKind.VariableStatement || node.kind === ts.SyntaxKind.ExpressionStatement){
    for (let i: number = 0; i < mapLength; i++){
      if (nodeText.indexOf(resourceMap[i].text) > -1){
        invalidResource = resourceMap[i].name;
        break;
      }
    }
  }
  return invalidResource;
};

const walk = (ctx: Lint.WalkContext<string[]>) => {
  if (!checkedIgnore){
    ignoredFiles = ctx.options;
    for (let i: number = 0; i < ignoredFiles.length; i++){
      if (ctx.sourceFile.fileName.indexOf(ignoredFiles[i]) > -1){
        ignoreCurrentFile = true;
        break;
      }
    }
    checkedIgnore = true;
  }
  if (!ignoreCurrentFile){
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
      const invalidResource: string = containsInvalidReference(node);
      if (!isUndefined(invalidResource)) {
        return ctx.addFailureAtNode(node, `${Rule.FAILURE_STRING_FACTORY(invalidResource)}`);
      }
      return ts.forEachChild(node, cb);
    });
  }
};