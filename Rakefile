#!/usr/bin/env ruby -wKU

require 'bundler'
Bundler.require

SOURCE = 'src/legs.js'

# 
# Release tasks
# 
desc "Generates release files"
task :release => [ :clobber, :debug, :minify, :docco ] do
  `git add .`
  `git commit -a -m 'release version #{@version}'`
end

desc "Clobbers bin and doc directories"
task :clobber do
  FileUtils.rm_rf 'bin'
  FileUtils.mkdir 'bin'
  FileUtils.rm_rf 'doc'
  FileUtils.mkdir 'doc'
end

desc "Copies over debug version"
task :debug => :version do
  File.open "bin/legs-#{@version}.js", "w+" do |f|
    f << IO.read( SOURCE )
  end
end

desc "Generates minified version"
task :minify => :version do
  File.open "bin/legs-#{@version}.min.js", "w+" do |f|
    f << Uglifier.new.compile( IO.read( SOURCE ) )
  end
end

desc "Generates docco docs"
task :docco => :version do
  File.open "doc/legs-#{@version}.html", "w+" do |f|
    f << Rocco.new( SOURCE, [ ], { :language => 'js' } ).to_html
  end
end

# 
# Environment tasks
# 
desc "Finds the current version of legs-js"
task :version do
  @version = IO.read( SOURCE )[ /VERSION : '(\d+\.\d+\.\d+)'/, 1 ]
end

# 
# Test tasks
# 
desc "Runs the test suite"
task :test do
  # you lazy bastard...
  `open test/index.html`
end