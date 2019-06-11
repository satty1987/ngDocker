import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'proper-class-var-init',
        type: 'style',
        description: `ensure that class variables do not get initialised outside of constructor or function`,
        rationale: `to enforce property initialisation best practice`,
        options: null,
        optionsDescription: `Not configurable.`,
        typescriptOnly: true,
    };

    public static FAILURE_STRING: string = 'Class variables must be initialised inside a constructor or function';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}
const fileIsComponentOrService = (filename: string): boolean => {
    return filename.indexOf('.component.ts') > -1 || filename.indexOf('.service.ts') > -1;
};

const invalidVariableInitialisation = (node: ts.Node): boolean => {
    let text: string = node.getText();
    let invalid: boolean = false;
    switch (node.kind) {
        case ts.SyntaxKind.PropertyDeclaration:
            text = node.getText();
            if (text.indexOf('=') !== -1) {
                invalid = true;
            }
            break;
        default:
            invalid = false;
    }

    return invalid;
};

const walk = (ctx: Lint.WalkContext<void>) => {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (fileIsComponentOrService(ctx.sourceFile.fileName) && invalidVariableInitialisation(node)) {
            return ctx.addFailureAtNode(node, `${Rule.FAILURE_STRING}}`);
        }

        return ts.forEachChild(node, cb);
    });
};