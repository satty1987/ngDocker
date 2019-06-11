import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'use-subscribe-with-takeuntil',
        type: 'style',
        description: 'Ensure subscribe is used with takeuntil and have properly handled in ngOnDestroy',
        rationale: 'To assist in unsubscription',
        options: null,
        optionsDescription: 'Not configurable.',
        typescriptOnly: true,
    };

    public static FAILURE_STRING_TAKEUNTILL: string = 'subscribe should be used with takeuntil';
    public static FAILURE_STRING_ONDESTROY: string = 'subscribe should be used with takeuntil and handled properly in ngOnDestroy';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }

}
const fileIsComponent = (filename: string): boolean => {
    return filename.indexOf('.component.ts') > -1;
};

const containsNgOnDestroyNotWithUnsubscribe = (node: ts.Node): boolean => {
    let invalid: boolean = false;
    if (node.kind === ts.SyntaxKind.MethodDeclaration && node.getText().indexOf('ngOnDestroy') !== -1) {
        invalid = !node.getChildren()
            .find((ch: ts.Node) => ch.kind === ts.SyntaxKind.Block).getChildren()
            .filter((ch: ts.Node) => ch.kind === ts.SyntaxKind.SyntaxList)
            .every((nd: ts.Node) => nd.getText().indexOf('.next()') !== -1
                && nd.getText().indexOf('.complete()') !== -1);
    }
    return invalid;
};

const toggleSubscribeWithTakeuntil = (node: ts.Node, flag: boolean) => {
    let invalid: boolean = false;
    if (node.kind === ts.SyntaxKind.PropertyAccessExpression) {
        const text = node.getText().replace(/\r\n\s*/g, '');
        const takeUntillIndex = text.indexOf('.takeUntil');
        const subscribeIndex = text.indexOf('.subscribe');
        invalid = (subscribeIndex !== -1 && text.charAt(subscribeIndex - 1) === ')' &&
            (flag ? takeUntillIndex === -1 : takeUntillIndex !== -1));
    }
    return invalid;
};

const containsSubscribeNotWithTakeuntil = (node: ts.Node): boolean => toggleSubscribeWithTakeuntil(node, true);

const containsSubscribeWithTakeuntil = (node: ts.Node): boolean => toggleSubscribeWithTakeuntil(node, false);

const walk = (ctx: Lint.WalkContext<void>) => {
    let containsSubscribeNotWithTakeuntilRes;
    let containsSubscribeWithTakeuntilRes = false;
    let containsNgOnDestroyNotWithUnsubscribeRes = false;
    let ngOnDestroyNode: ts.Node;
    const cb = (node: ts.Node): void => {
        if (fileIsComponent(ctx.sourceFile.fileName)) {
            containsSubscribeNotWithTakeuntilRes = containsSubscribeNotWithTakeuntil(node);
            containsSubscribeWithTakeuntilRes = containsSubscribeWithTakeuntilRes
                || containsSubscribeWithTakeuntil(node);
            containsNgOnDestroyNotWithUnsubscribeRes = containsNgOnDestroyNotWithUnsubscribeRes
                || containsNgOnDestroyNotWithUnsubscribe(node);
            if (!ngOnDestroyNode && containsNgOnDestroyNotWithUnsubscribeRes) {
                ngOnDestroyNode = node;
            }
            if (containsSubscribeNotWithTakeuntilRes) {
                return ctx.addFailureAtNode(node, `${Rule.FAILURE_STRING_TAKEUNTILL}`);
            }
            else if (containsSubscribeWithTakeuntilRes && containsNgOnDestroyNotWithUnsubscribeRes) {
                return ctx.addFailureAtNode(ngOnDestroyNode, `${Rule.FAILURE_STRING_ONDESTROY}`);
            }
        }
        return ts.forEachChild(node, cb);
    };
    return ts.forEachChild(ctx.sourceFile, cb);
};
