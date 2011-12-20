/****************************************************************************************************
 * Templates
 ****************************************************************************************************/

function nodeHtml(id, size, x, y) {
 return ('<div class="' + size + ' node" id="node_' + id + '" style="left: ' + x + 'px; top: ' + y + 'px">\
     <div class="head">\
       <h2 class="label"></h2>\
       <input class="save hidden" type="button" value="Save">\
     </div>\
     <div class="body"></div>\
     <div class="foot"></div>\
   </div>');
}
  
function propertyTableHeader() {
  return '<table class="props"><tr><th>Key</th><th>Value</th><th>Type</th></tr>';
}

function propertyTableFooter() {
  return '</table>';
}

function propertyTableRow(key, value, type) {
  if (value && type) {
    switch (type) {
      case "String" :
        if (value.length < 40) {
          return '<tr><td class="key">' + key + '</td><td class="value"><input type="text" size="40" maxlength="40" name="' + key + '" value="' + value + '"></td><td class="type">' + type + '</td></tr>';
        } else {
          return '<tr><td class="key">' + key + '</td><td class="value"><textarea cols="40" rows="4" name="' + key + '">' + value + '</textarea></td><td class="type">' + type + '</td></tr>';
        }
        break;
          case "Long" :
          return '<tr><td class="key">' + key + '</td><td class="value"><input type="text" size="40" maxlength="40" name="' + key + '" value="' + value + '"></td><td class="type">' + type + '</td></tr>';
        break;
          case "Boolean" :
          var output = '<tr><td class="key">' + key + '</td><td class="value"><input type="checkbox" name="' + key + '"';
        if (value == "true") {
          output += ' checked="checked"';
        }
        return output + '></td><td class="type">' + type + '</td></tr>';
        break;
          default :
          return '<tr><td class="key">' + key + '</td><td class="value">' + $('<div/>').text(value).html() + '</td><td class="type">' + type + '</td></tr>';
        break;
      }
   }
  
}

/****************************************************************************************************
 * Helper
 ****************************************************************************************************/

/**
 * Return value of URL parameter with given name
 */
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

/**
 * Return a random integer between 0 and max
 */
function rand(max) {
  return Math.floor(Math.random()*max+1);
}

function nextPos(oldPos,r) {
  var angle = rand(360);
  return [oldPos[0] + r*Math.cos(angle), oldPos[1] + r*Math.sin(angle)];
}

/****************************************************************************************************
 * Drawing
 ****************************************************************************************************/

/**
 * Draw a relationship with given type and id
 * [x1,y1], [x2,y2]: center of start and end node element
 * [w1,h1], [w2,h2]: width and height of start and end node element
 */
function drawRel(ctx, type, id, x1, y1, x2, y2, w1, h1, w2, h2) {
  
  if (ctx) {

    x1-=11; y1-=11; w1+=2; h1+=2;
    x2-=11; y2-=11; w2+=2; h2+=2;

    var ax,ay,bx,by;
    
    var cx = (h1/2)*(x2-x1)/(y2-y1);
    var cy = (w1/2)*(y2-y1)/(x2-x1);
    var dx = (h2/2)*(x2-x1)/(y2-y1);
    var dy = (w2/2)*(y2-y1)/(x2-x1);

    if (y2>=y1) {
      
      ax = Math.min(Math.max(x1+cx, x1-(w1/2)), x1+(w1/2));
      bx = Math.min(Math.max(x2-dx, x2-(w2/2)), x2+(w2/2));
    
    } else if (y1>y2) {
    
      ax = Math.min(Math.max(x1-cx, x1-(w1/2)), x1+(w1/2));
      bx = Math.min(Math.max(x2+dx, x2-(w2/2)), x2+(w2/2));
    
    }
    
    if (x2-dx > x2+(w2/2) || x2-dx < x2-(w2/2)) {
      
      if (x2>=x1) {
        
        ay = Math.min(Math.max(y1+cy, y1-(h1/2)), y1+(h1/2));
        by = Math.min(Math.max(y2-dy, y2-(h2/2)), y2+(h2/2));
        
      } else if (x1>x2) {
        
        ay = Math.min(Math.max(y1-cy, y1-(h1/2)), y1+(h1/2));
        by = Math.min(Math.max(y2+dy, y2-(h2/2)), y2+(h2/2));
        
      }
      
    } else {
      
      if (y2>=y1) {
        
        ay = y1+(h1/2);
        by = y2-(h2/2);
        
      } else if (y1>y2) {
        
        ay = y1-(h1/2);
        by = y2+(h2/2);
        
      }
    }      
    
    drawArrow(ctx, ax, ay, bx, by);
    drawText(ctx, type + ' ['+id+']', bx-(bx-ax)/2, by-(by-ay)/2);
    
  }
}

/**
 * Draw given text at the specified position
 */
function drawText(ctx, text, x, y) {
  if (text && x && y) {
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(text, x, y);
  }
}

/**
 * Draw an arrow from [x1,y1] to [x2,y2]
 */
function drawArrow(ctx, x1, y1, x2, y2){
  var size = 10;
  var angle = Math.atan2(y2-y1,x2-x1);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  var x3 = x2-size*Math.cos(angle-Math.PI/6);
  var y3 = y2-size*Math.sin(angle-Math.PI/6);
  ctx.lineTo(x3,y3);
  ctx.moveTo(x2,y2);
  var x4 = x2-size*Math.cos(angle+Math.PI/6);
  var y4 = y2-size*Math.sin(angle+Math.PI/6);
  ctx.lineTo(x4,y4);
  ctx.lineTo(x3,y3);
  ctx.lineTo(x2,y2);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}