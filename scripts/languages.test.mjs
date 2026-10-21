import {test} from 'node:test';import assert from 'node:assert/strict';
import {languageAlternates,spanishRoutes} from '../lib/languages.ts';
test('each pilot route advertises reciprocal equivalents with its own canonical',()=>{for(const route of spanishRoutes){for(const prefix of ['','/ar','/es']){const path=prefix+(route==='/'?'':route)||'/';const a=languageAlternates(path);assert.equal(a.canonical,'https://famed-vorbereitung.com'+path);assert.equal(a.languages.es,'https://famed-vorbereitung.com/es'+(route==='/'?'':route));assert.equal(Object.keys(a.languages).length,4);}}});
test('untranslated article paths never advertise fictional Spanish counterparts',()=>{for(const path of ['/blog/test','/ar/blog/test','/unknown'])assert.equal(languageAlternates(path).languages.es,undefined);});
