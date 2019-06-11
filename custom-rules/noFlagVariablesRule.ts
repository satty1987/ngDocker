import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-flag-variables',
    type: 'style',
    description: `ensure that boolean variables do not have the word flag in them`,
    rationale: `to enforce descriptive variable naming`,
    options: null,
    optionsDescription: `Not configurable.`,
    typescriptOnly: true,
  };

  public static FAILURE_STRING: string = 'variables should not have flag, use boolean type instead';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

const invalidVariableName = (node: ts.Node): boolean => {
    const text: string = node.getText().toLowerCase();
    let invalidName: boolean = false;
    switch (node.kind) {
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.VariableDeclaration:
        case ts.SyntaxKind.PropertyDeclaration:   
            invalidName = text.split('=')[0].indexOf('flag') > -1;
            break;        
        default:
            invalidName = false;
    }

    return invalidName;
};

const walk = (ctx: Lint.WalkContext<void>) => {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (invalidVariableName(node)) {
            return ctx.addFailureAtNode(node, `${Rule.FAILURE_STRING}}`);
        }
        return ts.forEachChild(node, cb);
    });
};