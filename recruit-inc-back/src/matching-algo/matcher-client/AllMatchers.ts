import {AbstractLanguageMatcher} from "../matcher/AbstractLanguageMatcher";
import {AbstractFrameworkMatcher} from "../matcher/AbstractFrameworkMatcher";
import {ReactMatcher} from "../matcher/Javascript/ReactMatcher";
import {TypescriptMatcher} from "../matcher/Javascript/TypescriptMatcher";
import {JavascriptMatcher} from "../matcher/Javascript/JavascriptMatcher";
import {PythonMatcher} from "../matcher/Python/PythonMatcher";
import {DjangoMatcher} from "../matcher/Python/DjangoMatcher";


const reactMatcher: AbstractFrameworkMatcher = new ReactMatcher();
const typescriptMatcher: AbstractFrameworkMatcher = new TypescriptMatcher();
const javascriptMatcher: AbstractLanguageMatcher = new JavascriptMatcher();
const pythonMatcher : AbstractLanguageMatcher = new PythonMatcher();
const djangoMatcher : AbstractFrameworkMatcher = new DjangoMatcher();

javascriptMatcher.addFramework(reactMatcher).addFramework(typescriptMatcher);
pythonMatcher.addFramework(djangoMatcher);

export const allMatchers: AbstractLanguageMatcher[] = [
    javascriptMatcher,
    pythonMatcher
];

export const pythonMatchers : AbstractLanguageMatcher[] = [
    pythonMatcher
];
export const jsMatchers : AbstractLanguageMatcher[] = [
    javascriptMatcher
];