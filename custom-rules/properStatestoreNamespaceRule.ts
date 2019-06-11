import * as ts from 'typescript';
import * as Lint from 'tslint';

const syntaxKinds: Set<ts.SyntaxKind> = new Set([
  ts.SyntaxKind.VariableStatement,
  ts.SyntaxKind.ExpressionStatement,
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.IfStatement,
  ts.SyntaxKind.ForStatement,
]);

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'proper-statestore-namespace',
    type: 'style',
    description: `Ensure that paths used in StateStore align to namespace pattern`,
    rationale: `To enforce conformity to statestore namespace pattern`,
    options: {
        type: 'array',
        items: {
          type: 'string'
        }
    },
    optionsDescription: 'list of flows for statestore',
    typescriptOnly: true,
  };

  public static FAILURE_STRING: string = 'invalid flow name in StateStore path flow';

  public isEnabled(): boolean {
    return super.isEnabled() && this.ruleArguments.length > 0;
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
      return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
  }
}

const containsInvalidNamespace = (node: ts.Node, allowedFlows: string[]): boolean => {
  let invalidNamespace: boolean = false;
  const nodeText: string = node.getText().toLowerCase();
  if (syntaxKinds.has(node.kind)
    && (nodeText.indexOf('.setstate(\'') > -1 || nodeText.indexOf('.getstate(\'') > -1)){
      invalidNamespace = true;
      for (let i: number = 0; i < allowedFlows.length; i++){
        if (nodeText.indexOf(`etstate('${allowedFlows[i]}.`) > -1){
          invalidNamespace = false;
          break;
        }
      }
  }
  return invalidNamespace;
};

const walk = (ctx: Lint.WalkContext<string[]>) => {
  const allowedFlows: string[] = ctx.options;
  return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
      if (containsInvalidNamespace(node, allowedFlows)) {
        return ctx.addFailureAtNode(node, `${Rule.FAILURE_STRING}`);
      }
      return ts.forEachChild(node, cb);
  });
};