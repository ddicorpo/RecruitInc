import {AbstractLanguageMatcher} from "../matcher/AbstractLanguageMatcher";
import {AbstractFrameworkMatcher} from "../matcher/AbstractFrameworkMatcher";
import {ReactMatcher} from "../matcher/Javascript/ReactMatcher";
import {TypescriptMatcher} from "../matcher/Javascript/TypescriptMatcher";
import {JavascriptMatcher} from "../matcher/Javascript/JavascriptMatcher";


const reactMatcher: AbstractFrameworkMatcher = new ReactMatcher();
const typescriptMatcher: AbstractFrameworkMatcher = new TypescriptMatcher();
const javascriptMatcher: AbstractLanguageMatcher = new JavascriptMatcher();

javascriptMatcher.addFramework(reactMatcher).addFramework(typescriptMatcher);

export const allMatchers: AbstractLanguageMatcher[] = [
    javascriptMatcher
];