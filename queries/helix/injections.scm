(code
  (inner_code) @injection.content (#set! injection.include-unnamed-children)
  (language_marker (language_name) @injection.language)
)

(codeblock
  (language_name) @injection.language
  (inner_codeblock) @injection.content (#set! injection.include-unnamed-children)
)
