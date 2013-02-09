

Tracer.new
t = Tracer.new
t.on {

}
t.add_filter { |a,b,*c| b.match(/app/) }
