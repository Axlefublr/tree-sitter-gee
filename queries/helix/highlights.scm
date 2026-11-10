(heading1_header (heading_title) @markup.heading.1) @markup.heading.marker
(heading2_header (heading_title) @markup.heading.2) @markup.heading.marker
(heading3_header (heading_title) @markup.heading.3) @markup.heading.marker
(heading4_header (heading_title) @markup.heading.4) @markup.heading.marker
(heading5_header (heading_title) @markup.heading.5) @markup.heading.marker
(heading6_header (heading_title) @markup.heading.6) @markup.heading.marker

(heading1_line) @markup.heading.1
(heading2_line) @markup.heading.2
(heading3_line) @markup.heading.3
(heading4_line) @markup.heading.4
(heading5_line) @markup.heading.5
(heading6_line) @markup.heading.6

(semantic_operator) @operator.markup
(return_operator) @operator.markup
(nulling_operator) @operator.markup
(italic) @markup.italic
(bold) @markup.bold
(italibold) @markup.italicbold
(strikethrough) @markup.strikethrough
(bracket (inner_bracket) @markup.loose)
(triangle (inner_triangle) @markup.strict)
(type (type_word) @type)
(typed_bracket (bracket) . "≔" @operator.markup)
(typed_triangle (triangle) . "≔" @operator.markup)
(attached_type (type (type_word) @type) . "≔" @operator.markup)
(reference (inner_reference) @markup.reference)
(code (inner_code) @markup.raw.inline)
(code (inner_code) @markup.raw.inline (language_name) @comment)
(codeblock (language_name) @comment)
