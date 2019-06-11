import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'no-addeventlistener-directive',
        type: 'style',
        description: `Ensure that EventTarget.addEventListener() is not added for dom manipulation and use Renderer2.listen in directives`,
        rationale: `To prevent memoryleaks by not removing the event listener`,
        options: null,
        optionsDescription: 'not configurable',
        typescriptOnly: true,
    };

    public static FAILURE_STRING_ADDEVTLISTENER: string = `EventTarget.addEventListener() should not be used for DOM manipulation. Instead, use Renderer2.listen`;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
    }
}
const fileIsDirective = (filename: string): boolean => {
    return filename.indexOf('.directive.ts') > -1;
};

const containsExStmtWithAddEvtListener = (node: ts.Node): boolean => {
    return node.kind === ts.SyntaxKind.ExpressionStatement && node.getText().indexOf('addEventListener') !== -1;
};

const walk = (ctx: Lint.WalkContext<string[]>) => {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (fileIsDirective(ctx.sourceFile.fileName) && containsExStmtWithAddEvtListener(node)) {
            return ctx.addFailureAtNode(node, `${Rule.FAILURE_STRING_ADDEVTLISTENER}`);
        }
        return ts.forEachChild(node, cb);
    });
};
