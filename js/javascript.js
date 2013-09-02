function tree_toggle(event) {

	//identify whether was click on icon Expand 
	//use event.target or event.srcElement for cross-browser
	event = event || window.event
	var clickedElem = event.target || event.srcElement

	if (!hasClass(clickedElem, 'Expand')) {
		// click was not on Expand
		return 
	}

	// node with was cliked
	var node = clickedElem.parentNode
	if (hasClass(node, 'ExpandLeaf')) {
		//click on leaf
		return
	}

	// difine(change) new class for node
	var newClass;
	if ( hasClass(node, 'ExpandOpen') ) {
		newClass = 'ExpandClosed'	
	} else {
		newClass = 'ExpandOpen'
	}
	// replace current class into newClass
	// RegExp find stand-alone open|close and changes it to newClass
	var re =  /(^|\s)(ExpandOpen|ExpandClosed)(\s|$)/
	node.className = node.className.replace(re, '$1'+newClass+'$3');

	//check`s node for class
	function hasClass(elem, className) {
		return new RegExp("(^|\\s)"+className+"(\\s|$)").test(elem.className)
	}

}

window.onload = function() {

	var input,
		buttonAddNode,
		buttonAddLeaf,
		target,
		RootNode,
		ExpandNode,
		LeafNode,
		LeafRootNode,
		appendTo,
		newValue,
		element,
		parent,
		elemHighl,
		elemMain;


	var addNode = {
		//I tried to do all handlers and methods in object literal,
		//I never used to factory pattern in my life, but think it was a good practice for me :)  
		getInput: function() {
			input = document.getElementById('inputForNode');

			return input
		},

		clearInput: function() {
			addNode.getInput()

			input.onclick = function(e) {
				e = e || event;
				var target = e.target || e.srcElement;
				input.value = ""	
			}
		},

		RootNode: function() {
			RootNode = document.createElement('li');
			RootNode.className = 'Node IsRoot ExpandClosed';
			RootNode.innerHTML = '<div class="Expand"></div> \
								 <div class="Content">'+newValue+'</div> \
								 <ul class="Container"></ul>';
			return RootNode;
		},

		ExpandNode: function() {
			ExpandNode = document.createElement('li');
			ExpandNode.className = 'Node ExpandClosed IsLast';
			ExpandNode.innerHTML = '<div class="Expand"></div> \
								    <div class="Content">'+newValue+'</div> \
								    <ul class="Container"></ul>';
			return ExpandNode
		},

		LeafRootNode: function() {
			LeafRootNode = document.createElement('li');
			LeafRootNode.className = 'Node IsRoot ExpandLeaf IsLast';
			LeafRootNode.innerHTML = '<div class="Expand"></div> \
								 	  <div class="Content">'+newValue+'</div>';	
			return LeafRootNode
		},

		LeafNode: function() {
			LeafNode = document.createElement('li');
			LeafNode.className = 'Node ExpandLeaf IsLast';
			LeafNode.innerHTML = '<div class="Expand"></div> \
								 <div class="Content">'+newValue+'</div>';
			return LeafNode
		},

		createNode: function() {
			buttonAddNode = document.getElementById('addNode');

			buttonAddNode.onclick = function(e) {
				e = e || event;
				target = e.target || e.srcElement;

				appendTo = document.querySelectorAll('.Highlight > ul.Container');
				elemHighl = document.querySelectorAll('.Highlight');
				elemMain = document.querySelectorAll('.Main');
		
				newValue = input.value

				if ( elemHighl[0] != undefined ) {
					//appendTo.appendChild(addNode.ExpandNode())
					//exit from colection that gives us getElementsByClassName
					for (var i = 0; i < appendTo.length; i++){
						appendTo[i].appendChild(addNode.ExpandNode())
					}
				} else {
					for (var i = 0; i < elemMain.length; i++) {
						elemMain[i].appendChild(addNode.RootNode())
					}
				};
			};

			buttonAddLeaf = document.getElementById('addLeaf');

			buttonAddLeaf.onclick = function(e) {
				e = e || event;
				target = e.target || e.srcElement;

				appendTo = document.querySelectorAll('.Highlight > ul.Container');
				elemHighl = document.querySelectorAll('.Highlight');
				elemMain = document.querySelectorAll('.Main');

				newValue = input.value;

				if ( elemHighl[0] != undefined ) {
					//appendTo.appendChild(addNode.ExpandNode())
					//exit from colection that gives us getElementsByClassName
					for (var i = 0; i < appendTo.length; i++){
						appendTo[i].appendChild(addNode.LeafNode())
					}
				} else {
					for (var i = 0; i < elemMain.length; i++) {
						elemMain[i].appendChild(addNode.LeafRootNode())
					}
				};
			}
		},

		selectNode: function() {
			//set time interval, because after create new node I can't properly get it :(
			setInterval(function() {

				//for ie
				function getElementsByClassName(node, classname) {
					var a = [];
					var re = new RegExp('(^| )'+classname+'( |$)');
					var els = node.getElementsByTagName("*");
					for(var i=0,j=els.length; i<j; i++)
					    if(re.test(els[i].className))a.push(els[i]);
					return a;
				}

				element = getElementsByClassName(document.body, 'Content');
				function hasClass(elem, className) {
					return new RegExp("(^|\\s)"+className+"(\\s|$)").test(elem.className)
				}

				for (var i = 0; i < element.length; i++) {
					
					element[i].onclick = function(e) {
						e = e || event;
						target = e.target || e.srcElement;

						parent = this.parentNode;
				
						if ( hasClass(parent, 'Highlight') ) {
							parent.className = parent.className.replace(/\ Highlight\b/,'');
						} else {
							parent.className += " Highlight";	
						}
					};
				}

				return element;
			}, 1000);
		},


		/*previous jQuery contextMneu plagin
		contextMenu : function() {
			//var treeViewer = document.getElementsByClassName('treeViewer')[0];
			var treeViewer = $('.treeViewer')

			$('.treeViewer').contextmenu({
				delegate: ".Node",

				beforeOpen: function(event, ui) {
					ui.target.parent().addClass('Highlight');
				},

				close: function(event) {
					$('div .Highlight').removeClass('Highlight');
				},

		        menu: [
		        	 {title: 'New File', cmd: 'new', uiIcon: "ui-icon-new",
		                action: function(event, ui) {
		                	
		                	newValue = input.value;
		                	
		                    ui.target.parent().find('.Container').append(addNode.LeafNode());
		                }
		            },
		            {title: 'New Folder', cmd: 'new', uiIcon: "ui-icon-new",
		                action: function(event, ui) {
		                	
		                	newValue = input.value;
		                	
		                    ui.target.parent().find('.Container').append(addNode.ExpandNode());
		                }
		            },
		            {title: 'New Root Fooler', cmd: 'new', uiIcon: "ui-icon-new",
		                action: function(event, ui) {
		                	
		                	newValue = input.value;
		                	
		                    $('.Main').append(addNode.RootNode());
		                }
		            },
		            {title: "----"},
		            {title: 'Rename', cmd: 'rename', uiIcon: "ui-icon-copy",
		                action: function(event, ui) {
		                    
		                    var newValue = prompt('Enter new name');
		                    if ( newValue != null ) {
		                    	ui.target.text(newValue)
		                    }
		                    
		                } 
		            },
		            {title: "Delete", cmd: "delete", uiIcon: "ui-icon-scissors", 
		                action: function(event, ui) {
		                    
		                    ui.target.parent().remove()
		                }
		            },
		            {title: "More", children: [
		                {title: "Sub 1", cmd: "sub1"},
		                {title: "Sub 2", cmd: "sub1"}
		                ]}
		            ],
		        click: function(event, ui) {
		            alert("select " + ui.cmd + " on " + ui.target.text());
		        },

		        
		    });
		},*/
		pureContectMenu: function() {

			var _replaceContext = false;								// replace the system context menu?
			var _mouseOverContext = false;								// is the mouse over the context menu?
			var _noContext = false;										// disable the context menu?
			var _divContext = document.getElementById('divContext')     // work with?

			InitContext();


			function InitContext() {

				_divContext.onmouseover = function() { _mouseOverContext = true; };
				_divContext.onmouseout = function() { _mouseOverContext = false; };

				document.getElementById('contextDisable').onclick = DisableContext;
				document.getElementById('contextEnable').onclick = EnableContext;

				document.body.onmousedown = ContextMouseDown;
				document.body.oncontextmenu = ContextShow;
			}

			//hack for ie
			function getElementsByClassName(node, classname) {
				var a = [];
				var re = new RegExp('(^| )'+classname+'( |$)');
				var els = node.getElementsByTagName("*");
				for(var i=0,j=els.length; i<j; i++)
				    if(re.test(els[i].className))a.push(els[i]);
				return a;
			}

			

			// call from the onMouseDown event, passing the event if standards compliant
			function ContextMouseDown(event) {
				
				if (_noContext || _mouseOverContext) {
					return;
				}
					
				// IE doesn't pass the event object
				if (event == null) {
					event = window.event;
				}
					
				// we assume we have a standards compliant browser, but check if we have IE
				//var target;
				if (event.target != null) {
					target = event.target
				} else {
					target = event.srcElement;
				}

				// only show the context menu if the right mouse button is pressed
				// and Node has been clicked (the code can be made more selective)
				
				var parentElem = target.parentNode

				//comfortable function
				function hasClass(elem, className) {
					return new RegExp("(^|\\s)"+className+"(\\s|$)").test(elem.className)
				}

				if (event.button == 2 && hasClass(parentElem, 'Node') ) {

					_replaceContext = true;
				} else if (!_mouseOverContext) {
					_divContext.style.display = 'none';
				}
				

			}

			function CloseContext()	{
				_mouseOverContext;
				_divContext.style.display = 'none';
			}

			// call from the onContextMenu event, passing the event
			// if this function returns false, the browser's context menu will not show up
			function ContextShow(event)	{
				if (_noContext || _mouseOverContext) {
					return;
				}
					
				// IE doesn't pass the event object
				if (event == null) {
					event = window.event;
				}
					
				// we assume we have a standards compliant browser, but check if we have IE
				//var target = event.target != null ? event.target : event.srcElement;

				//var target = event.target
				//var target;
				if (event.target != null) {
					target = event.target
				} else {
					target = event.srcElement;
				}

				if (_replaceContext) {

					target.parentNode.className += ' Highlight';

					var scrollTop;
					if (document.body.scrollTop) {
						scrollTop = document.body.scrollTop;
					} else {
						scrollTop = document.documentElement.scrollTop
					};

					var scrollLeft;
					if (document.body.scrollLeft) {
						scrollLeft = document.body.scrollLeft;
					} else {
						scrollLeft = document.documentElement.scrollLeft
					};

					// hide the menu first to avoid an "up-then-over" visual effect
					_divContext.style.display = 'none';
					_divContext.style.left = event.clientX + scrollLeft + 'px';
					_divContext.style.top = event.clientY + scrollTop + 'px';
					_divContext.style.display = 'block';

					//console.log(event.clientX)
					//console.log(event.clientY)

					//contextAddNode();

					_replaceContext = false;

					return false;
				}
			};

			function removeClass(className) {
			    // convert the result to an Array object

			    var els = Array.prototype.slice.call(
			        getElementsByClassName(document, className)
			    );
			    for (var i = 0, l = els.length; i < l; i++) {
			        var el = els[i];
			        el.className = el.className.replace(
			            new RegExp('(^|\\s+)' + className + '(\\s+|$)', 'g'),
			            '$1'
			        );
			    }
			};

			(function contextAddNode() {
				var contextAddNode = document.getElementById('contextAddNode');
				var contextRename = document.getElementById('contextRename');
				var contextDelete = document.getElementById('contextDelete');
				var contextRenameNew = document.getElementById('contextRenameNew')

				contextAddLeaf.onclick = function() {
					var parentElem = target.parentNode;

					var parentElemContainer = parentElem.querySelectorAll('.Container')

					newValue = input.value;

					if (parentElemContainer[0] != undefined) {
						parentElemContainer[0].appendChild(addNode.LeafNode())
					}

					CloseContext();
					removeClass('Highlight');
				}

				contextAddNode.onclick = function() {
					var parentElem = target.parentNode;

					var parentElemContainer = parentElem.querySelectorAll('.Container')

					newValue = input.value;

					if (parentElemContainer[0] != undefined) {
						parentElemContainer[0].appendChild(addNode.ExpandNode())
					}

					CloseContext();
					removeClass('Highlight');
				};

				contextAddRootNode.onclick = function() {
					newValue = input.value;
		                	
		            var parentElem = getElementsByClassName(document.body, 'Main')

		            parentElem[0].appendChild(addNode.RootNode());

		            CloseContext();
					removeClass('Highlight');
				}

				contextRename.onclick = function() {
					//console.log('contextRename')

					var newValue = prompt('Enter new name');
				    if ( newValue != null ) {
				  	  target.innerHTML = newValue;
				    }

					CloseContext();
					removeClass('Highlight');
				};

				contextDelete.onclick = function() {

					var parentElem = target.parentNode;
					var parentContainer = parentElem.parentNode
					parentContainer.removeChild(parentElem);

					CloseContext();
				};

				contextRenameNew.onclick = function() {
					var elements = document.querySelectorAll('div.Content')

					var helper = document.createElement('DIV');
					helper.setAttribute('Id', 'helper');
					helper.setAttribute('style', 'margin-left: 25px')
					helper.innerHTML = 'For confirm press Enter'
					target.parentNode.appendChild(helper)
				
					target.setAttribute('oldText', target.innerHTML); 
					// not actually required. I use target just in case you want to cancel and set the original text back.
					var textBox = document.createElement('INPUT');
						textBox.setAttribute('type', 'text');

						textBox.value = target.innerHTML;

						textBox.onkeypress = function(e) {
							var ev = e || window.event;
		 					var key = ev.keyCode;

		 					//trigger enter
		 					if (key == 13) {

		 						var newValue = this.value;
								this.parentNode.innerText = newValue;

								var forRemove = document.getElementById('helper');
								forRemove.parentNode.removeChild(forRemove)

								removeClass('Highlight');
		 					}
						}

						target.innerHTML = '';
						target.appendChild(textBox);
					
					removeClass('Highlight');
					CloseContext();
				}

			})();

			function DisableContext() {
				_noContext = true;
				CloseContext();
				document.getElementById('contextEnable').style.display = '';

				removeClass('Highlight');
				return false;
			};

			function EnableContext() {
				_noContext = false;
				_mouseOverContext = false; // this gets left enabled when "disable menus" is chosen
				document.getElementById('contextEnable').style.display = 'none';

				return false;
			};
		},

		init: function(){
			addNode.clearInput();
			addNode.createNode();
			addNode.selectNode();
			//addNode.contextMenu();
			addNode.pureContectMenu()
		}

	}
	addNode.init();
}