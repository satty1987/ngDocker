import * as ts from 'typescript';
import * as Lint from 'tslint';

const syntaxKinds: Set<ts.SyntaxKind> = new Set([
  ts.SyntaxKind.DoStatement,
  ts.SyntaxKind.WhileStatement,
  ts.SyntaxKind.ForStatement,
  ts.SyntaxKind.ForInStatement,
  ts.SyntaxKind.ForOfStatement,
]);

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-loop-func',
    type: 'style',
    description: `Ensure that functions are not defined within a loop`,
    rationale: `To prevent errors that result in the way functions create closure around the loop`,
    options: null,
    optionsDescription: 'not configurable',
    typescriptOnly: true,
  };

  public static FAILURE_STRING: string = 'functions must not be defined within a loop';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
      return this.applyWithFunction(sourceFile, walk);
  }
}

const containsFunctionDefinitionWithinLoop = (node: ts.Node): boolean => {
  const nodeText: string = node.getText();
  return syntaxKinds.has(node.kind) &&
  (nodeText.indexOf('=>') > -1 || nodeText.indexOf('function') > -1);
};

const walk = (ctx: Lint.WalkContext<null>) => {
  return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
      if (containsFunctionDefinitionWithinLoop(node)) {
        return ctx.addFailureAtNode(node, `${Rule.FAILURE_STRING}`);
      }
      return ts.forEachChild(node, cb);
  });
};