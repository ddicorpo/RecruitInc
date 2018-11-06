import {ICommit} from "../../../../src/matching-algo/data-model/input-model/ICommit";
import {ISingleFileCommit} from "../../../../src/matching-algo/data-model/input-model/ISingleFileCommit";
import { IProjectStructure } from "../../../../src/matching-algo/data-model/input-model/IProjectStructure";
import {IDataEntry} from "../../../../src/matching-algo/data-model/input-model/IDataEntry";
import {IGitProjectInput} from "../../../../src/matching-algo/data-model/input-model/IGitProjectInput";
import {ISourceFiles} from "../../../../src/matching-algo/data-model/input-model/ISourceFiles";

const projectStructure: IProjectStructure[] = [
    {
        "fileId": "d670f68044212dfb9cd0a3b3dc8b1a31e1c1c78c",
        "fileName": ".gitignore",
        "filePath": ".gitignore",

    },
    {
        "fileId": "98d3005dfac1214832dfe056918cc65b5619a722",
        "fileName": "README.md",
        "filePath": "README.md",

    },
    {
        "fileId": "546bc66d98537daf8c4c6b82a6b4b09474f461e3",
        "fileName": "manage.py",
        "filePath": "backend/manage.py",
    },
    {
        "fileId": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
        "fileName": "__init__.py",
        "filePath": "backend/src/__init__.py",

    },
    {
        "fileId": "2e54c01e987cfe65e65dda62532a28f59896f82b",
        "fileName": "settings.py",
        "filePath": "backend/src/settings.py",

    },
    {
        "fileId": "4e874c8be80c3372bf8c35d4d41e9ad3aeee17ca",
        "fileName": "urls.py",
        "filePath": "backend/src/urls.py",

    },
    {
        "fileId": "cc4b938800d72983841086b83dd874b501fb05a2",
        "fileName": "wsgi.py",
        "filePath": "backend/src/wsgi.py",

    },
    {
        "fileId": "30a6c7f1b6dae5f390575e490a085d5a8c496429",
        "fileName": "env.js",
        "filePath": "frontend/config/env.js",

    },
    {
        "fileId": "8f65114812a4e5726d2e4148cd15481c33e1cfec",
        "fileName": "cssTransform.js",
        "filePath": "frontend/config/jest/cssTransform.js",

    },
    {
        "fileId": "9e4047d358ded7f5ed067f1f2fa7c9b178f7ae18",
        "fileName": "fileTransform.js",
        "filePath": "frontend/config/jest/fileTransform.js",

    },
    {
        "fileId": "6d16efc99eb817885026dcc70e4467a1276ffd53",
        "fileName": "paths.js",
        "filePath": "frontend/config/paths.js",

    },
    {
        "fileId": "66dff0a8b1419497fc2be6b9eb3ba88bf37f335c",
        "fileName": "polyfills.js",
        "filePath": "frontend/config/polyfills.js",

    },
    {
        "fileId": "740a444ceb7290436024228eb7ce58950bbb9868",
        "fileName": "webpack.config.dev.js",
        "filePath": "frontend/config/webpack.config.dev.js",

    },
    {
        "fileId": "5a89a0695e3e8028d20c15a139fc5e92f9dccb98",
        "fileName": "webpack.config.prod.js",
        "filePath": "frontend/config/webpack.config.prod.js",

    },
    {
        "fileId": "f12d315944e02672f634389b15f745bc1761d09b",
        "fileName": "webpackDevServer.config.js",
        "filePath": "frontend/config/webpackDevServer.config.js",

    },
    {
        "fileId": "bfad87deae43185ad258c69cd470b97aff92dacf",
        "fileName": "package-lock.json",
        "filePath": "frontend/package-lock.json",

    },
    {
        "fileId": "328aca6548bec2cbee4086c494e4964769ccf510",
        "fileName": "package.json",
        "filePath": "frontend/package.json",
    },
    {
        "fileId": "a11777cc471a4344702741ab1c8a588998b1311a",
        "fileName": "favicon.ico",
        "filePath": "frontend/public/favicon.ico",
    },
    {
        "fileId": "ed0ebafa1b7c3057e5fc3eddbdf9e4c2c46de805",
        "fileName": "index.html",
        "filePath": "frontend/public/index.html",
    },
    {
        "fileId": "ef19ec243e739479802a5553d0b38a18ed845307",
        "fileName": "manifest.json",
        "filePath": "frontend/public/manifest.json",
    },
    {
        "fileId": "5709f48cfcbdc0f76509ff9e40e4756f741acaa1",
        "fileName": "build.js",
        "filePath": "frontend/scripts/build.js",
    },
    {
        "fileId": "c5acbe5773106a095ff8550e55368477f74f9f88",
        "fileName": "start.js",
        "filePath": "frontend/scripts/start.js",
    },
    {
        "fileId": "45a643ac05d218262f10a951ebc85e1d75fe8929",
        "fileName": "test.js",
        "filePath": "frontend/scripts/test.js",
    },
    {
        "fileId": "c5c6e8a68adcb5249ebdf283ffb34b8531d8b1f0",
        "fileName": "App.css",
        "filePath": "frontend/src/App.css",
    },
    {
        "fileId": "203067e4d7553b342bf6507a30ced6f5c806e1c5",
        "fileName": "App.js",
        "filePath": "frontend/src/App.js",
    },
    {
        "fileId": "a754b201bf9c6caf5271293588189fb4210f99d1",
        "fileName": "App.test.js",
        "filePath": "frontend/src/App.test.js",
    },
    {
        "fileId": "b4cc7250b98cb3f1a2dd5bec134296c6942344d9",
        "fileName": "index.css",
        "filePath": "frontend/src/index.css",
    },
    {
        "fileId": "fae3e3500cf003c76f0065ffd12df759c9ccb6aa",
        "fileName": "index.js",
        "filePath": "frontend/src/index.js",
    },
    {
        "fileId": "6b60c1042f58d9fabb75485aa3624dddcf633b5c",
        "fileName": "logo.svg",
        "filePath": "frontend/src/logo.svg",
    },
    {
        "fileId": "a3e6c0cfc10de36d6bcb38c52e00c012e985d68e",
        "fileName": "registerServiceWorker.ts",
        "filePath": "frontend/src/registerServiceWorker.ts",

    }
];


const singleCommitGitIgnore: ISingleFileCommit = {
    filePath: ".gitignore",
    lineAdded: 141,
    lineDeleted: 0
};

const singleCommitReadMe: ISingleFileCommit = {
    filePath: "README.md",
    lineAdded: 1,
    lineDeleted: 0
};

const singleCommitManagePy: ISingleFileCommit = {
    filePath: "backend/manage.py",
    lineAdded: 15,
    lineDeleted: 0
};

const singleCommitInitPy: ISingleFileCommit = {
    filePath: "backend/src/__init__.py",
    lineAdded: 0,
    lineDeleted: 0
};

const singleCommitSettingsPy: ISingleFileCommit = {
    filePath: "backend/src/settings.py",
    lineAdded: 129,
    lineDeleted: 0
};

const singleCommitUrlPy: ISingleFileCommit = {
    filePath: "backend/src/urls.py",
    lineAdded: 21,
    lineDeleted: 0
};

const singleCommitWSGIPy: ISingleFileCommit = {
    filePath: "backend/src/wsgi.py",
    lineAdded: 16,
    lineDeleted: 0
};

const singleCommitEnvJs: ISingleFileCommit = {
    filePath: "frontend/config/env.js",
    lineAdded: 93,
    lineDeleted: 0
};

const singleCommitCssTransformJs: ISingleFileCommit = {
    filePath: "frontend/config/jest/cssTransform.js",
    lineAdded: 14,
    lineDeleted: 0
};

const singleCommitFileTransformJs: ISingleFileCommit = {
    filePath: "frontend/config/jest/fileTransform.js",
    lineAdded: 12,
    lineDeleted: 0
};

const singleCommitPathsJs: ISingleFileCommit = {
    filePath: "frontend/config/paths.js",
    lineAdded: 55,
    lineDeleted: 0
};

const singleCommitPolyFillsJs: ISingleFileCommit = {
    filePath: "frontend/config/polyfills.js",
    lineAdded: 22,
    lineDeleted: 0
};

const singleCommitWebpackDevJs: ISingleFileCommit = {
    filePath: "frontend/config/webpack.config.dev.js",
    lineAdded: 262,
    lineDeleted: 0
};

const singleCommitWebpackProdJs: ISingleFileCommit = {
    filePath: "frontend/config/webpack.config.prod.js",
    lineAdded: 342,
    lineDeleted: 0
};

const singleCommitWebpackServerJs: ISingleFileCommit = {
    filePath: "frontend/config/webpackDevServer.config.js",
    lineAdded: 95,
    lineDeleted: 0
};

const singleCommitPackagelockJson: ISingleFileCommit = {
    filePath: "frontend/package-lock.json",
    lineAdded: 11200,
    lineDeleted: 0
};

const singleCommitPackageJson: ISingleFileCommit = {
    filePath: "frontend/package.json",
    lineAdded: 11200,
    lineDeleted: 0
};

const singleCommitFavicon: ISingleFileCommit = {
    filePath: "frontend/public/favicon.ico",
    lineAdded: 0,
    lineDeleted: 0
};

const singleCommitIndexHtml: ISingleFileCommit = {
    filePath: "frontend/public/index.html",
    lineAdded: 40,
    lineDeleted: 0
};

const singleCommitManifestJson: ISingleFileCommit = {
    filePath: "frontend/public/manifest.json",
    lineAdded: 15,
    lineDeleted: 0
};

const singleCommitBuildJs: ISingleFileCommit = {
    filePath: "frontend/scripts/build.js",
    lineAdded: 150,
    lineDeleted: 0
};

const singleCommitStartJs: ISingleFileCommit = {
    filePath: "frontend/scripts/start.js",
    lineAdded: 107,
    lineDeleted: 0
};

const singleCommitTestJs: ISingleFileCommit = {
    filePath: "frontend/scripts/test.js",
    lineAdded: 27,
    lineDeleted: 0
};

const singleCommitAppCss: ISingleFileCommit = {
    filePath: "frontend/src/App.css",
    lineAdded: 28,
    lineDeleted: 0
};

const singleCommitAppTestJs: ISingleFileCommit = {
    filePath: "frontend/src/App.test.js",
    lineAdded: 9,
    lineDeleted: 0
};

const singleCommitIndexCss: ISingleFileCommit = {
    filePath: "frontend/src/index.css",
    lineAdded: 5,
    lineDeleted: 0
};

const singleCommitLogoSvg: ISingleFileCommit = {
    filePath: "frontend/src/logo.svg",
    lineAdded: 0,
    lineDeleted: 0
};

const singleCommitAppJs: ISingleFileCommit = {
    filePath: "frontend/src/App.js",
    lineAdded: 21,
    lineDeleted: 0
};

const singleCommitRegisterServiceWorkerTs: ISingleFileCommit = {
    filePath: "frontend/src/registerServiceWorker.ts",
    lineAdded: 117,
    lineDeleted: 0
};

const singleCommitIndexJs: ISingleFileCommit = {
    filePath: "frontend/src/index.js",
    lineAdded: 8,
    lineDeleted: 0
};

const singleCommitAppJs1: ISingleFileCommit = {
    filePath: "frontend/src/App.js",
    lineAdded: 154,
    lineDeleted: 10
};

const singleCommitAppJs2: ISingleFileCommit = {
    filePath: "frontend/src/App.js",
    lineAdded: 45,
    lineDeleted: 13
};

const singleCommitRegisterServiceWorkerTs1: ISingleFileCommit = {
    filePath: "frontend/src/registerServiceWorker.ts",
    lineAdded: 253,
    lineDeleted: 57
};

const singleCommitIndexJs1: ISingleFileCommit = {
    filePath: "frontend/src/index.js",
    lineAdded: 45,
    lineDeleted: 2
};



const commitInput1: ICommit = {
    id: "66dff0a8b1419497fc2be6b9eb3ba88bf37f335a",
    numberOfFileAffected: 3,
    files: [singleCommitGitIgnore, singleCommitManagePy, singleCommitAppJs]
};

const commitInput2: ICommit = {
    id: "66dff0a8b1419497fc2be6b9eb3ba88bf37f335b",
    numberOfFileAffected: 27,
    files: [
        singleCommitAppCss,
        singleCommitAppTestJs,
        singleCommitBuildJs,
        singleCommitCssTransformJs,
        singleCommitEnvJs,
        singleCommitFavicon,
        singleCommitFileTransformJs,
        singleCommitIndexCss,
        singleCommitIndexHtml,
        singleCommitIndexJs,
        singleCommitInitPy,
        singleCommitLogoSvg,
        singleCommitManifestJson,
        singleCommitPackageJson,
        singleCommitPackagelockJson,
        singleCommitPathsJs,
        singleCommitPolyFillsJs,
        singleCommitReadMe,
        singleCommitRegisterServiceWorkerTs,
        singleCommitSettingsPy,
        singleCommitStartJs,
        singleCommitTestJs,
        singleCommitUrlPy,
        singleCommitWebpackDevJs,
        singleCommitWebpackProdJs,
        singleCommitWebpackServerJs,
        singleCommitWSGIPy,
    ]
};

const commitInput3: ICommit = {
    id: "66dff0a8b1419497fc2be6b9eb3ba88bf37f335c",
    numberOfFileAffected: 12,
    files: [singleCommitAppJs1, singleCommitWSGIPy, singleCommitInitPy, singleCommitManagePy]
};

const commitInput4: ICommit = {
    id: "66dff0a8b1419497fc2be6b9eb3ba88bf37f335d",
    numberOfFileAffected: 2,
    files: [singleCommitRegisterServiceWorkerTs1, singleCommitIndexCss]
};

const commitInput5: ICommit = {
    id: "66dff0a8b1419497fc2be6b9eb3ba88bf37f335e",
    numberOfFileAffected: 3,
    files: [singleCommitIndexJs1, singleCommitAppJs2, singleCommitIndexHtml]
};

const pathToFakePackageJson : string = __dirname +  "/files-downloaded/package.downloaded.json";
const pathToFakeGitIgnore : string = __dirname + "/files-downloaded/gitignore.downloaded";

const packageJsonSourceFile: ISourceFiles = {
    filename: "package.json",
    repoFilePath: "frontend/package.json",
    localFilePath: pathToFakePackageJson
};

const gitIgnoreSourceFile: ISourceFiles = {
    filename: ".gitignore",
    repoFilePath: ".gitignore",
    localFilePath: pathToFakeGitIgnore
};

const projectInput: IGitProjectInput = {
    projectName: "Django-React-04",
    applicantCommits: [
        commitInput1,
        commitInput2,
        commitInput3,
        commitInput4,
        commitInput5
    ],
    projectStructure,
    downloadedSourceFile: [
        packageJsonSourceFile,
        gitIgnoreSourceFile
    ]
};

export const dataEntry: IDataEntry = {
    projectInputs: [
        projectInput
    ]
};
