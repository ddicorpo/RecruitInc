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
        React.createElement("a", { style: linkStyle }, "About")),
    React.createElement(link_1.default, { href: "/admin" },
        React.createElement("a", { style: linkStyle }, "Admin")),
    React.createElement(link_1.default, { href: "/hr" },
        React.createElement("a", { style: linkStyle }, "hr"))));
exports.default = Header;
