// Copyright 2016 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --harmony-types


load("test/mjsunit/harmony/typesystem/typegen.js");
debug = true;


// In all the following functions, the size parameter (positive integer)
// denotes how many test cases will be tried.  The variable test_size
// controls execution time of this test.  It should not be too high.
let test_size = default_test_size;


function ValidFormalParameters(size) {
  return Generate(size, [
    "()",
    "(x)",
    "(x, y)",
    "(x?)",
    "(x?, y)",
    "(x, y?)",
    new TestGen(1, ValidTypes, [
      t => "(x : " + t + ")",
      t => "(x : " + t + " = undefined)",
      t => "(x? : " + t + ")",
      t => "(x : " + t + ", y : " + t + ")",
      t => "(x : " + t + " = undefined, y : " + t + ")",
      t => "(x? : " + t + ", y)",
      t => "(x? : " + t + ", y : " + t + ")"
    ]),
    "(...rest)",
    "(x, ...rest)",
    "(x, y, ...rest)",
    "(x?, ...rest)",
    "(x?, y, ...rest)",
    "(x, y?, ...rest)",
    new TestGen(1, ValidTypes, [
      t => "(...rest : (" + t + ")[])",
      t => "(x : " + t + ", ...rest : (" + t + ")[])",
      t => "(x? : " + t + ", y : " + t + ", ...rest : (" + t + ")[])"
    ]),
  ]);
}

function InvalidFormalParameters(size) {
  return Generate(size, [
    new TestGen(1, InvalidTypes, [
      t => "(x : " + t + ")",
      t => "(x : " + t + "= undefined)",
      t => "(x? : " + t + ")",
      t => "(x : " + t + ", y : " + t + ")",
      t => "(x = undefined, y : " + t + ")",
      t => "(x? : " + t + ", y)",
      t => "(x?, y : " + t + ")"
    ]),
    "(x? = 42)",
    "(x? : number = 42)",
    "(...rest?)",
    "(...rest? : number)",
    "(first, ...rest?)",
    "(first, ...rest? : number)"
  ]);
}

function ValidParameters(size) {
  return Generate(size, [
    new TestGen(1, ValidFormalParameters, [
      p => p,
      p => "<A>" + p,
      p => "<A, B>" + p,
      p => "<A extends {x:number}>" + p,
      p => "<A extends {x:number}, B>" + p,
      p => "<A, B extends {x:number}>" + p
    ])
  ]);
}

function InvalidParameters(size) {
  return Generate(size, [
    new TestGen(1, InvalidFormalParameters, [
      p => p,
      p => "<A>" + p,
      p => "<A, B>" + p,
      p => "<A extends {x:number}>" + p,
      p => "<A extends {x:number}, B>" + p,
      p => "<A, B extends {x:number}>" + p
    ]),
    "<>(x : number)",
    "<A,>(s : string)",
    "<A extends ()>()"
  ]);
}

function ValidFunctionDeclarations(size) {
  return Generate(size, [
    new TestGen(1, ValidParameters, [
      p => "function f " + p + " {}; f()",
      p => "function* f " + p + " {}; f()",
      p => "(function " + p + " {})()",
      p => "(function* " + p + " {})()",
      p => "function f " + p + " : number {}; f()",
      p => "function* f " + p + " : string[] {}; f()",
      p => "(function " + p + " : [any, number] {})()",
      p => "(function* " + p + " : {a:number, b:string|boolean} {})()"
    ]),
    "function f ([x, y] : [any, any]) {}; f([1, 2])",
    "function f ([x, y] : [any, any]) : number {}; f([1, 2])",
    "(function ([x, y] : [any, any]) {})([1,2])",
    "(function ([x, y] : [any, any]) : number {})([1,2])",
    "function f ([first, ...rest] : string[]) {}; f(['hello', 'world'])",
    "function f ([first, ...rest] : string[]) : number {}; f(['hello', 'world'])",
    "(function ([first, ...rest] : string[]) {})(['hello', 'world'])",
    "(function ([first, ...rest] : string[]) : number {})(['hello', 'world'])",
    "function f ([one,,three] : number[], ...rest : string[]) {}; f([1,2,3])",
    "function f ([one,,three] : number[], ...rest : string[]) : number {}; f([1,2,3])",
    "(function ([one,,three] : number[], ...rest : string[]) {})([1,2,3])",
    "(function ([one,,three] : number[], ...rest : string[]) : number {})([1,2,3])",
    "function f ({a:x, b:y}? : {a:number, b:string}) {}; f({})",
    "function f ({a:x, b:y}? : {a:number, b:string}) : number {}; f({})",
    "(function ({a:x, b:y}? : {a:number, b:string}) {})({})",
    "(function ({a:x, b:y}? : {a:number, b:string}) : number {})({})"
  ]);
}

function InvalidFunctionDeclarations(size) {
  return Generate(size, [
    new TestGen(1, InvalidParameters, [
      p => "function f " + p + " {}",
      p => "function* f " + p + " {}",
      p => "(function " + p + " {})()",
      p => "(function* " + p + " {})()",
      p => "function f " + p + " : number {}",
      p => "function* f " + p + " : string[] {}",
      p => "(function " + p + " : [any, number] {})()",
      p => "(function* " + p + " : {a:number, b:string|boolean} {})()"
    ]),
    new TestGen(1, InvalidTypes, [
      t => "function f() : " + t + " {}",
      t => "function* f() : " + t + " {}",
      t => "(function () : " + t + " {})()",
      t => "(function* () : " + t + " {})()"
    ])
  ]);
}

(function TestFunctionDeclarations(size) {
  Test(size, [
    new TestGen(1, ValidFunctionDeclarations, [CheckValid]),
    new TestGen(1, InvalidFunctionDeclarations, [CheckInvalid]),
  ]);
})(test_size);
