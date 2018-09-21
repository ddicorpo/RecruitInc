"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = require("next/link");
const React = require("react");
const linkStyle = {
    marginRight: 15
};
const Header = () => (React.createElement("div", null,
    React.createElement(link_1.default, { href: "/" },
        React.createElement("a", { style: linkStyle }, "Home")),
    React.createElement(link_1.default, { href: "/about" },
        React.createElement("a", { style: linkStyle }, "About"))));
exports.default = Header;
