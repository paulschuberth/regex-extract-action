import './sourcemap-register.cjs';/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

var __createBinding = (undefined && undefined.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (undefined && undefined.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (undefined && undefined.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const core = __importStar(require("@actions/core"));
const extractor_1 = require("./extractor");
const fs_1 = require("fs");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let haystack = core.getInput('haystack');
            const mode = core.getInput('mode');
            const readMode = core.getInput('read_mode');
            const customNeedle = core.getInput('needle');
            const untilInput = core.getInput('until');
            const until = untilInput ? new RegExp(untilInput, 'gmi') : undefined;
            if (readMode === 'file') {
                haystack = yield fs_1.promises.readFile(haystack, 'utf8');
            }
            const matches = yield (0, extractor_1.extractor)(haystack, {
                needle: new RegExp(customNeedle, 'gmi'),
                until,
                mode
            });
            core.startGroup('Inputs');
            core.info(`Haystack: ${haystack}`);
            core.info(`Needle: ${customNeedle}`);
            core.info(`Until: ${until}`);
            core.info(`Mode: ${mode}`);
            core.info(`Read mode: ${readMode}`);
            core.endGroup();
            core.startGroup('Outputs');
            core.info(`Matches: ${matches}`);
            core.endGroup();
            const hasMatches = matches.length > 0;
            core.setOutput('has_matches', hasMatches);
            core.setOutput('matches', matches);
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();


//# sourceMappingURL=index.js.map