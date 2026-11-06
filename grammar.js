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
    [$.underline, $._stray],
    [$.strikethrough, $._stray_in_underline],
    [$.strikethrough, $._stray],
    [$.bold, $._stray_in_underline],
    [$.bold, $._stray_in_strikethrough],
    [$.bold, $._stray],
    [$.italic, $._stray_in_underline],
    [$.italic, $._stray_in_strikethrough],
    [$.italic, $._stray_in_bold],
    [$.italic, $._stray],
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

    _word_underline: $ => choice($.italic, $.bold, $.strikethrough, repeat1(choice($._stray_in_underline, $._plain))),
    _word_strikethrough: $ => choice($.italic, $.bold, repeat1(choice($._stray_in_strikethrough, $._raw_in_strikethrough, $._plain))),
    _word_bold: $ => choice($.italic, repeat1(choice($._stray_in_bold, $._raw_in_bold, $._plain))),
    _word_italic: $ => repeat1(choice($._raw_in_italic, $._plain)),
    _word: $ => choice($.italic, $.bold, $.strikethrough, $.underline, $._plain, $._stray),

    inner_underline:       $ => seq($._word_underline, repeat(seq($._space, $._word_underline))),
    inner_strikethrough:   $ => seq($._word_strikethrough, repeat(seq($._space, $._word_strikethrough))),
    inner_bold:            $ => seq($._word_bold,   repeat(seq($._space, $._word_bold))),
    inner_italic:          $ => seq($._word_italic, repeat(seq($._space, $._word_italic))),

    underline:       $ => prec.dynamic(1, seq('_', $.inner_underline, '_')),
    strikethrough:   $ => prec.dynamic(1, seq('~', $.inner_strikethrough, '~')),
    bold:            $ => prec.dynamic(1, seq('*', $.inner_bold, '*')),
    italic:          $ => prec.dynamic(1, seq('/', $.inner_italic, '/')),

    _raw_in_strikethrough: _ => '_',
    _raw_in_bold: _ => choice('~', '_'),
    _raw_in_italic: _ => choice('*', '~', '_'),

    _stray_in_underline: _ => choice('/', '*', '~'),
    _stray_in_strikethrough: _ => choice('/', '*'),
    _stray_in_bold: _ => '/',

    _stray: _ => choice('/', '*', '~', '_'),
    _plain: _ => /[^\s/*~_]+/,

    _separator: _ => /(([ \t]*)\n)+/,
    _newline: _ => "\n",
    _space: _ => /[ \t]+/,
  }
});
