import { AbstractLanguageMatcher } from '../matcher/AbstractLanguageMatcher';
import { AbstractFrameworkMatcher } from '../matcher/AbstractFrameworkMatcher';
import { ReactMatcher } from '../matcher/Javascript/ReactMatcher';
import { TypescriptMatcher } from '../matcher/Javascript/TypescriptMatcher';
import { JavascriptMatcher } from '../matcher/Javascript/JavascriptMatcher';
import { PythonMatcher } from '../matcher/Python/PythonMatcher';
import { DjangoMatcher } from '../matcher/Python/DjangoMatcher';
import { VueMatcher } from '../matcher/Javascript/VueMatcher';
import { AngularMatcher } from '../matcher/Javascript/AngularMatcher';
import { CsharpMatcher } from '../matcher/Csharp/csharpMatcher';
import { JavaMatcher } from '../matcher/Java/JavaMatcher';

const javascriptMatcher: AbstractLanguageMatcher = new JavascriptMatcher();
const reactMatcher: AbstractFrameworkMatcher = new ReactMatcher();
const vueMatcher: AbstractFrameworkMatcher = new VueMatcher();
const angularMatcher: AbstractFrameworkMatcher = new AngularMatcher();
const typescriptMatcher: AbstractFrameworkMatcher = new TypescriptMatcher();
const javaMatcher: AbstractLanguageMatcher = new JavaMatcher();

const pythonMatcher: AbstractLanguageMatcher = new PythonMatcher();
const csharpMatcher: AbstractLanguageMatcher = new CsharpMatcher();

const djangoMatcher: AbstractFrameworkMatcher = new DjangoMatcher();

javascriptMatcher
  .addFramework(reactMatcher)
  .addFramework(typescriptMatcher)
  .addFramework(vueMatcher)
  .addFramework(angularMatcher);
pythonMatcher.addFramework(djangoMatcher);

export const allMatchers: AbstractLanguageMatcher[] = [
  javascriptMatcher,
  pythonMatcher,
  csharpMatcher,
  javaMatcher,
];

export const pythonMatchers: AbstractLanguageMatcher[] = [pythonMatcher];
export const jsMatchers: AbstractLanguageMatcher[] = [javascriptMatcher];
