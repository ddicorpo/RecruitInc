import {ICommit} from "../../../src/matching-algo/data-model/input-model/ICommit";
import {ISingleFileCommit} from "../../../src/matching-algo/data-model/input-model/ISingleFileCommit";

var project = {
    "id": 8919310,
    "description": "Django-React project to build a to-do app with Pytest, Jest and Cypress e2e testing.",
    "name": "Django-React-04",
    "name_with_namespace": "csp5096 / Django-React-04",
    "path": "Django-React-04",
    "path_with_namespace": "csp5096/Django-React-04",
    "created_at": "2018-10-17T20:21:17.346Z",
    "default_branch": "master",
    "tag_list": [],
    "ssh_url_to_repo": "git@gitlab.com:csp5096/Django-React-04.git",
    "http_url_to_repo": "https://gitlab.com/csp5096/Django-React-04.git",
    "web_url": "https://gitlab.com/csp5096/Django-React-04",
    "readme_url": "https://gitlab.com/csp5096/Django-React-04/blob/master/README.md",
    "avatar_url": null,
    "star_count": 0,
    "forks_count": 0,
    "last_activity_at": "2018-10-17T20:21:17.346Z",
    "namespace": {
        "id": 102150,
        "name": "csp5096",
        "path": "csp5096",
        "kind": "user",
        "full_path": "csp5096",
        "parent_id": null
    }
};

var repositoryTree = [
    {
        "id": "d670f68044212dfb9cd0a3b3dc8b1a31e1c1c78c",
        "name": ".gitignore",
        "type": "blob",
        "path": ".gitignore",
        "mode": "100644"
    },
    {
        "id": "98d3005dfac1214832dfe056918cc65b5619a722",
        "name": "README.md",
        "type": "blob",
        "path": "README.md",
        "mode": "100644"
    },
    {
        "id": "546bc66d98537daf8c4c6b82a6b4b09474f461e3",
        "name": "manage.py",
        "type": "blob",
        "path": "backend/manage.py",
        "mode": "100755"
    },
    {
        "id": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
        "name": "__init__.py",
        "type": "blob",
        "path": "backend/src/__init__.py",
        "mode": "100644"
    },
    {
        "id": "2e54c01e987cfe65e65dda62532a28f59896f82b",
        "name": "settings.py",
        "type": "blob",
        "path": "backend/src/settings.py",
        "mode": "100644"
    },
    {
        "id": "4e874c8be80c3372bf8c35d4d41e9ad3aeee17ca",
        "name": "urls.py",
        "type": "blob",
        "path": "backend/src/urls.py",
        "mode": "100644"
    },
    {
        "id": "cc4b938800d72983841086b83dd874b501fb05a2",
        "name": "wsgi.py",
        "type": "blob",
        "path": "backend/src/wsgi.py",
        "mode": "100644"
    },
    {
        "id": "30a6c7f1b6dae5f390575e490a085d5a8c496429",
        "name": "env.js",
        "type": "blob",
        "path": "frontend/config/env.js",
        "mode": "100644"
    },
    {
        "id": "8f65114812a4e5726d2e4148cd15481c33e1cfec",
        "name": "cssTransform.js",
        "type": "blob",
        "path": "frontend/config/jest/cssTransform.js",
        "mode": "100644"
    },
    {
        "id": "9e4047d358ded7f5ed067f1f2fa7c9b178f7ae18",
        "name": "fileTransform.js",
        "type": "blob",
        "path": "frontend/config/jest/fileTransform.js",
        "mode": "100644"
    },
    {
        "id": "6d16efc99eb817885026dcc70e4467a1276ffd53",
        "name": "paths.js",
        "type": "blob",
        "path": "frontend/config/paths.js",
        "mode": "100644"
    },
    {
        "id": "66dff0a8b1419497fc2be6b9eb3ba88bf37f335c",
        "name": "polyfills.js",
        "type": "blob",
        "path": "frontend/config/polyfills.js",
        "mode": "100644"
    },
    {
        "id": "740a444ceb7290436024228eb7ce58950bbb9868",
        "name": "webpack.config.dev.js",
        "type": "blob",
        "path": "frontend/config/webpack.config.dev.js",
        "mode": "100644"
    },
    {
        "id": "5a89a0695e3e8028d20c15a139fc5e92f9dccb98",
        "name": "webpack.config.prod.js",
        "type": "blob",
        "path": "frontend/config/webpack.config.prod.js",
        "mode": "100644"
    },
    {
        "id": "f12d315944e02672f634389b15f745bc1761d09b",
        "name": "webpackDevServer.config.js",
        "type": "blob",
        "path": "frontend/config/webpackDevServer.config.js",
        "mode": "100644"
    },
    {
        "id": "bfad87deae43185ad258c69cd470b97aff92dacf",
        "name": "package-lock.json",
        "type": "blob",
        "path": "frontend/package-lock.json",
        "mode": "100644"
    },
    {
        "id": "328aca6548bec2cbee4086c494e4964769ccf510",
        "name": "package.json",
        "type": "blob",
        "path": "frontend/package.json",
        "mode": "100644"
    },
    {
        "id": "a11777cc471a4344702741ab1c8a588998b1311a",
        "name": "favicon.ico",
        "type": "blob",
        "path": "frontend/public/favicon.ico",
        "mode": "100644"
    },
    {
        "id": "ed0ebafa1b7c3057e5fc3eddbdf9e4c2c46de805",
        "name": "index.html",
        "type": "blob",
        "path": "frontend/public/index.html",
        "mode": "100644"
    },
    {
        "id": "ef19ec243e739479802a5553d0b38a18ed845307",
        "name": "manifest.json",
        "type": "blob",
        "path": "frontend/public/manifest.json",
        "mode": "100644"
    },
    {
        "id": "5709f48cfcbdc0f76509ff9e40e4756f741acaa1",
        "name": "build.js",
        "type": "blob",
        "path": "frontend/scripts/build.js",
        "mode": "100644"
    },
    {
        "id": "c5acbe5773106a095ff8550e55368477f74f9f88",
        "name": "start.js",
        "type": "blob",
        "path": "frontend/scripts/start.js",
        "mode": "100644"
    },
    {
        "id": "45a643ac05d218262f10a951ebc85e1d75fe8929",
        "name": "test.js",
        "type": "blob",
        "path": "frontend/scripts/test.js",
        "mode": "100644"
    },
    {
        "id": "c5c6e8a68adcb5249ebdf283ffb34b8531d8b1f0",
        "name": "App.css",
        "type": "blob",
        "path": "frontend/src/App.css",
        "mode": "100644"
    },
    {
        "id": "203067e4d7553b342bf6507a30ced6f5c806e1c5",
        "name": "App.js",
        "type": "blob",
        "path": "frontend/src/App.js",
        "mode": "100644"
    },
    {
        "id": "a754b201bf9c6caf5271293588189fb4210f99d1",
        "name": "App.test.js",
        "type": "blob",
        "path": "frontend/src/App.test.js",
        "mode": "100644"
    },
    {
        "id": "b4cc7250b98cb3f1a2dd5bec134296c6942344d9",
        "name": "index.css",
        "type": "blob",
        "path": "frontend/src/index.css",
        "mode": "100644"
    },
    {
        "id": "fae3e3500cf003c76f0065ffd12df759c9ccb6aa",
        "name": "index.js",
        "type": "blob",
        "path": "frontend/src/index.js",
        "mode": "100644"
    },
    {
        "id": "6b60c1042f58d9fabb75485aa3624dddcf633b5c",
        "name": "logo.svg",
        "type": "blob",
        "path": "frontend/src/logo.svg",
        "mode": "100644"
    },
    {
        "id": "a3e6c0cfc10de36d6bcb38c52e00c012e985d68e",
        "name": "registerServiceWorker.js",
        "type": "blob",
        "path": "frontend/src/registerServiceWorker.js",
        "mode": "100644"
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

const singleCommitRegisterServiceWorkerJs: ISingleFileCommit = {
    filePath: "registerServiceWorker.js",
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

const singleCommitRegisterServiceWorkerJs1: ISingleFileCommit = {
    filePath: "registerServiceWorker.js",
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
        singleCommitRegisterServiceWorkerJs,
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
    files: [singleCommitRegisterServiceWorkerJs1, singleCommitIndexCss]
};

const commitInput5: ICommit = {
    id: "66dff0a8b1419497fc2be6b9eb3ba88bf37f335e",
    numberOfFileAffected: 3,
    files: [singleCommitIndexJs1, singleCommitAppJs2, singleCommitIndexHtml]
};

var commits = [
    {
        "id": "0812db1b8795543ccdd824150d00fb6d6a5d2e1f",
        "short_id": "0812db1b",
        "title": "first commit",
        "created_at": "2018-06-04T23:41:46.000Z",
        "parent_ids": [],
        "message": "first commit\n",
        "author_name": "csp5096",
        "author_email": "christopherscpowell@gmail.com",
        "authored_date": "2018-06-04T23:41:46.000Z",
        "committer_name": "csp5096",
        "committer_email": "christopherscpowell@gmail.com",
        "committed_date": "2018-06-04T23:41:46.000Z",
        "stats": {
            "additions": 13046,
            "deletions": 0,
            "total": 13046
        }
    },
    {
        "id": "0776181e6827faaab899ae8dcb5fb949b5cd4284",
        "short_id": "0776181e",
        "title": "Update README.md",
        "created_at": "2018-06-04T23:42:59.000Z",
        "parent_ids": [
            "0812db1b8795543ccdd824150d00fb6d6a5d2e1f"
        ],
        "message": "Update README.md",
        "author_name": "Christopher Powell",
        "author_email": "csp5096@users.noreply.github.com",
        "authored_date": "2018-06-04T23:42:59.000Z",
        "committer_name": "GitHub",
        "committer_email": "noreply@github.com",
        "committed_date": "2018-06-04T23:42:59.000Z",
        "stats": {
            "additions": 1,
            "deletions": 1,
            "total": 2
        }
    }
];

