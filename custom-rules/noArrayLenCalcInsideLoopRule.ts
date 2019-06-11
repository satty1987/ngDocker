import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-arrayLen-calc-inside-loop',
        type: 'style',
        description: `Ensure array length is calculated outside of for loop`,
        rationale: `To improve performance`,
        options: null,
        optionsDescription: `Not configurable.`,
        typescriptOnly: true,
    };

    public static FAILURE_STRING: string = 'Array length should be calculated outside of for loop';

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

// Extracting and calculating length in condition section of for loop
const checkLengthInCondition = (forStatement: string): boolean => {
    const firstIndex = 1;
    forStatement = forStatement.
        substring(forStatement.indexOf(forKey) + 1, forStatement.indexOf(openBraceKey));
    return forStatement.split(semiColumnKey)[firstIndex].indexOf(lengthKey) > -1;
};

// Checking node is for statement and its calculating length in condition section 
const isArrayLenCalcOnLoop = (node: ts.Node): boolean => {
    return node.kind === ts.SyntaxKind.ForStatement && checkLengthInCondition(node.getText());
};

const walk = (ctx: Lint.WalkContext<void>) => {
    const cb = (node: ts.Node): void => {
        if (fileIsCmpntOrSrviceOrDirctve(ctx.sourceFile.fileName) && isArrayLenCalcOnLoop(node)) {
            return ctx.addFailureAtNode(node, `${Rule.FAILURE_STRING}`);
        }
        return ts.forEachChild(node, cb);
    };
    return ts.forEachChild(ctx.sourceFile, cb);
};
