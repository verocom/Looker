#  Chord

![](chord.png)

This diagram creates a [chord diagram](https://en.wikipedia.org/wiki/Chord_diagram), showing affinity between two dimensions. This is helpful for showing customer paths, market basket analysis, among others.

![](chord.mov)

**Implementation Instructions**
Follow the instructions in [Looker's documentation](https://docs.looker.com/admin-options/platform/visualizations). Note that this viz does not require an SRI hash and has no dependencies. Simply create a unique ID, a label for the viz, and paste in the CDN link below.

**CDN Link** 

Paste the following URL into the "Main" section of your Admin/Visualization page. 

https://looker-custom-viz-a.lookercdn.com/master/chord.js


**How it works**

Create a Look with one measure and two dimensions. The order of the dimensions does not really matter as the color will fall with the higher affinity direction.

For example, in the chord diagram featured above, more flights occur from LAX to ORD compared to ORD to LAX, so the chord color is associated with LAX.

**More Info**

The chord visualization is best used with dimensions that have a direct relationship between them. Hovering over a particular relationship between two dimensions will show both the value of the measure for the higher affinity measure as well as the lower affinity measure. In the context of the example above, hovering over the relationship between LAX and ORD will show both the number of flights that have originated in LAX and landed in ORD, and the number of flights that have originated in ORD and landed in LAX.
