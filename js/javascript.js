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
		parent;

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

			//appendTo = document.getElementsByClassName('Highlight');
			appendTo = $('.Highlight')

			buttonAddNode.onclick = function(e) {
				e = e || event;
				target = e.target || e.srcElement;
				//console.log(appendTo.firstChild)
				//console.log($('.Highlight')[0])
				newValue = input.value

				if ( $('.Highlight')[0] != undefined ) {
					$('.Highlight .Container').append(addNode.ExpandNode())
				} else {
					$('.Main ').append(addNode.RootNode())
				};
			};

			buttonAddLeaf = document.getElementById('addLeaf');

			buttonAddLeaf.onclick = function(e) {
				e = e || event;
				target = e.target || e.srcElement;

				newValue = input.value;


				if ( $('.Highlight')[0] != undefined ) {
					$('.Highlight .Container').append(addNode.LeafNode())
				} else {
					$('.Main ').append(addNode.LeafRootNode())
				};
			}
		},

		selectNode: function() {
			//set time interval, because after create new node I can't properly get it :(
			setInterval(function() {
				//element = document.getElementsByClassName('Content');
				element = $('.Content')
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
			}, 2000);
		},

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
		        /*click: function(event, ui) {
		            alert("select " + ui.cmd + " on " + ui.target.text());
		        },*/


		    });
		},

		init: function(){
			addNode.clearInput();
			addNode.createNode();
			addNode.selectNode();
			addNode.contextMenu();
		}

	}
	addNode.init();
}