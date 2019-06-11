import * as ts from 'typescript';
import * as Lint from 'tslint';

const allowedFunctions: string[] = [
    'window.innerWidth',
    'window.open',
    'window.print',
    'window.onpopstate',
    'window.matchMedia',
    'window.event',
    'event.type',
    'window.attachEvent',
    'document.createElement',
    'document.getElementsByTagName'
];

const syntaxKinds: Set<ts.SyntaxKind> = new Set([
  ts.SyntaxKind.VariableStatement,
  ts.SyntaxKind.ExpressionStatement,
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.IfStatement,
  ts.SyntaxKind.ForStatement,
]);

const numberOfAllowed: number = allowedFunctions.length;

let ignoreCurrentFile: boolean;
let checkedIgnore: boolean;

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-global-variables',
    type: 'style',
    description: `Ensure that no global variables are being used`,
    rationale: `To enforce conformity to no global variables pattern`,
    options: {
        type: 'array',
        items: {
          type: 'string'
        }
    },
    optionsDescription: 'list of files to ignore',
    typescriptOnly: true,
  };

  public static FAILURE_STRING: string = 'global variables should not be used';


  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    checkedIgnore = false;
    ignoreCurrentFile = false;
    return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
  }
}

// tslint:disable-next-line:no-global-variables
const containsGlobalVariable = (node: ts.Node): boolean => {
  let hasGlobal: boolean;
  const nodeText: string = node.getText().toLowerCase();
  if (syntaxKinds.has(node.kind) && (nodeText.indexOf('window.') > -1 || nodeText.indexOf('document.')) > -1){
    for (let i: number = 0; i < numberOfAllowed; i++){
      hasGlobal = true;
      if (nodeText.indexOf(allowedFunctions[i]) > -1){
        hasGlobal = false;
        break;
      }
    }
  }
  return hasGlobal;
};

const walk = (ctx: Lint.WalkContext<string[]>) => {
  if (!checkedIgnore){
    const ignoredFiles: string[] = ctx.options;
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
        if (containsGlobalVariable(node)) {
          return ctx.addFailureAtNode(node, `${Rule.FAILURE_STRING}`);
        }
        return ts.forEachChild(node, cb);
    });
  }
};