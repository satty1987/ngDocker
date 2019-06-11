import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'components-have-destroy',
    type: 'style',
    description: `Ensure components contain an ngOnDestroy function`,
    rationale: `To assist in garbage collection`,
    options: null,
    optionsDescription: `Not configurable.`,
    typescriptOnly: true,
  };

  public static FAILURE_STRING: string = 'components need to have an ngOnDestroy';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

const fileIsComponent = (filename: string): boolean => {
    return filename.indexOf('.component.ts') > -1;
};

const doesNotContainNgOnDestroy = (node: ts.Node): boolean => {
    return node.kind === ts.SyntaxKind.ClassDeclaration 
        && node.getText().indexOf('public ngOnDestroy(): void {') < 0;
};

const walk = (ctx: Lint.WalkContext<void>) => {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (fileIsComponent(ctx.sourceFile.fileName) && doesNotContainNgOnDestroy(node)) {
            return ctx.addFailureAtNode(node, `${Rule.FAILURE_STRING}`);
        }
        return ts.forEachChild(node, cb);
    });
};