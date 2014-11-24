class Hida

  constructor: (@viewer)->

    #######################################
    # Defaults
    #######################################

    @reader = @viewer.reader

    if @reader.isMultiFile()
      alert "HIDA doesn't support multi-frame analysis"

    @file = @viewer.file

    #######################################
    # Input
    #######################################

    # Patient Length
    @patient =
      length: 180   # TODO - CM
      weight: 80    # TODO - KG

    # BSA calculation based on Mosteller formula
    @bsa = Math.sqrt ((@patient.length * @patient.weight) / 3600)

    @t1 = time: 150 # Time of evenly distributed tracer 
    @t2 = time: 350 # ???

    # @t1.frame = # TODO
    # @t2.frame = # TODO