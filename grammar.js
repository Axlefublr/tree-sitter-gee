/**
 * @file Gee grammar for tree-sitter
 * @author Axlefublr <axlefublr.ls@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "gee",

  extras: _ => [],

  conflicts: $ => [
    [$.bold, $._stray],
    [$.italic, $._stray],
    [$.italic, $._stray_in_bold],
  ],

  rules: {
    source_file: $ => seq(
      optional($._separator),
      optional(seq(
        $._block,
        repeat(seq($._separator, $._block)),
        optional($._separator)
      )),
    ),

    _block: $ => choice($.paragraph),

    paragraph: $ => repeat1($.line),

    line: $ => seq(
      repeat1(choice($._space, $._word)),
      $._newline
    ),

    // underline > strikethrough > bold > italic
    // i.e. italic cannot contain a bold inside of it, a bold cannot contain a strikethrough inside of it, etc
    // underline can contain strikethrough / bold / italic
    // strikethrough can contain bold / italic but not underline
    // you cannot double bold something, you'll just end up with two stray `*` on each side, with a plain word on the inside
    // (the above is the intention, at least)

    _word_bold:   $ => choice($.italic, repeat1(choice($._stray_in_bold, $._plain))),
    _word_italic: $ =>                  repeat1(choice($._raw_in_italic, $._plain)),
    _word: $ => choice($.italic, $.bold, $._plain, $._stray),

    inner_bold:   $ => seq($._word_bold,   repeat(seq($._space, $._word_bold))),
    inner_italic: $ => seq($._word_italic, repeat(seq($._space, $._word_italic))),

    bold:   $ => prec.dynamic(10, seq('*', $.inner_bold, '*')),
    italic: $ => prec.dynamic(1, seq('/', $.inner_italic, '/')),

    _raw_in_italic: _ => '*',

    _stray_in_bold: _ => '/',

    _stray: _ => choice('/', '*'),
    _plain: _ => /[^\s/*]+/,

    _separator: _ => /(([ \t]*)\n)+/,
    _newline: _ => "\n",
    _space: _ => /[ \t]+/,
  }
});
