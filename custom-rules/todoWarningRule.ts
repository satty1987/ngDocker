import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'todo-warning',
        type: 'style',
        description: `Ensure all TODO comments are properly being addressed`,
        rationale: `To make sure unfinished business logic is properly addressed`,
        options: null,
        optionsDescription: `Not configurable.`,
        typescriptOnly: true,
    };

    public static WARNING_STRING: string = 'This file contains one or more TODO comments';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}
// String constants
const forKey = 'for';
const openBraceKey = '{';
const lengthKey = '.length';
const componentKey = '.component.ts';
const serviceKey = '.service.ts';
const directiveKey = '.directive.ts';
const semiColumnKey = ';';

// Checking file is either component, service or directive 
const fileIsCmpntOrSrviceOrDirctve = (filename: string): boolean => {
    return filename.indexOf(componentKey) > -1
        || filename.indexOf(serviceKey) > -1
        || filename.indexOf(directiveKey) > -1;
};

// Util function to find the matching keywords from an array in a string
const findIndexFromArr = (classDeclarationStr: string, keyWordArr: string[]): boolean =>
    keyWordArr.some((word: string) => classDeclarationStr.indexOf(word) > -1);

// Checking TODO in file 
const isTODOleftOut = (node: ts.Node, fileName: string): boolean => {
    if (fileIsCmpntOrSrviceOrDirctve(fileName)
        && node.kind === ts.SyntaxKind.ClassDeclaration
        && findIndexFromArr(node.getText(), ['TODO', 'TO-DO'])) {
        console.log('Warning:', fileName, ': ', `${Rule.WARNING_STRING}`);
    }
    return false;
};

const walk = (ctx: Lint.WalkContext<void>) => {
    const cb = (node: ts.Node): void => {
        isTODOleftOut(node, ctx.sourceFile.fileName);
        return ts.forEachChild(node, cb);
    };
    return ts.forEachChild(ctx.sourceFile, cb);
};
