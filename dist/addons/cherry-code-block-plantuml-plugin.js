"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var mergeWith_1 = __importDefault(require("lodash/mergeWith"));
var rawdeflate_1 = __importDefault(require("../libs/rawdeflate"));
function encode64(data) {
    var r = '';
    for (var i = 0; i < data.length; i += 3) {
        if (i + 2 === data.length) {
            r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
        }
        else if (i + 1 === data.length) {
            r += append3bytes(data.charCodeAt(i), 0, 0);
        }
        else {
            r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), data.charCodeAt(i + 2));
        }
    }
    return r;
}
function append3bytes(b1, b2, b3) {
    var c1 = b1 >> 2;
    var c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    var c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
    var c4 = b3 & 0x3f;
    var r = '';
    r += encode6bit(c1 & 0x3f);
    r += encode6bit(c2 & 0x3f);
    r += encode6bit(c3 & 0x3f);
    r += encode6bit(c4 & 0x3f);
    return r;
}
function encode6bit(b1) {
    var b = b1;
    if (b < 10) {
        return String.fromCharCode(48 + b);
    }
    b -= 10;
    if (b < 26) {
        return String.fromCharCode(65 + b);
    }
    b -= 26;
    if (b < 26) {
        return String.fromCharCode(97 + b);
    }
    b -= 26;
    if (b === 0) {
        return '-';
    }
    if (b === 1) {
        return '_';
    }
    return '?';
}
function compress(s1, url) {
    var s = unescape(encodeURIComponent(s1));
    return url + "/svg/" + encode64(rawdeflate_1.default(s, 9));
}
var PlantUMLCodeEngine = /** @class */ (function () {
    function PlantUMLCodeEngine(plantUMLOptions) {
        if (plantUMLOptions === void 0) { plantUMLOptions = {}; }
        var _a;
        var defaultUrl = 'http://www.plantuml.com/plantuml';
        this.baseUrl = (_a = plantUMLOptions.baseUrl) !== null && _a !== void 0 ? _a : defaultUrl;
    }
    PlantUMLCodeEngine.install = function (cherryOptions) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        mergeWith_1.default(cherryOptions, {
            engine: {
                syntax: {
                    codeBlock: {
                        customRenderer: {
                            plantuml: new (PlantUMLCodeEngine.bind.apply(PlantUMLCodeEngine, __spreadArray([void 0], args)))(),
                        },
                    },
                },
            },
        });
    };
    PlantUMLCodeEngine.prototype.render = function (src, sign) {
        var $sign = sign;
        if (!$sign) {
            $sign = Math.round(Math.random() * 100000000);
        }
        var graphId = "plantuml-" + $sign + "-" + new Date().getTime();
        return "<img id=\"" + graphId + "\" src=\"" + compress(src, this.baseUrl) + "\" />";
    };
    return PlantUMLCodeEngine;
}());
exports.default = PlantUMLCodeEngine;
