#!/usr/bin/env ruby -wKU

require 'net/http'
require 'uri'

desc "Minifies the code using Google Closure Compiler"
task :minify do
  uri = URI.parse 'http://closure-compiler.appspot.com/compile'
  res = Net::HTTP.post_form( uri,
    {
      :compilation_level => 'WHITESPACE_ONLY',
      :output_format     => 'text',
      :output_info       => 'compiled_code',
      :js_code           => IO.read( 'src/legs.js' )
    } )
  
  File.open 'bin/legs.min.js', 'w' do |f|
    f << res.body
  end
end

desc "Runs the test suite"
task :test do
  # you lazy bastard...
  `open test/index.html`
end