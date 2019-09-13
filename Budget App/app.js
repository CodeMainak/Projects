//BUDGET CONTROLLER
var budgetController=(function(){
	var Expances=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
		this.percentage=-1;
	};
	Expances.prototype.calcPercentages=function(totalIncome){
		if(totalIncome>0){
			this.percentage=Math.round(((this.value/totalIncome)*100));
		}else{
			this.percentage=-1;
		}
	};
	Expances.prototype.getPercentage=function(){
		return this.percentage;
	};
	var Income=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
	};
	var calculateTotal=function(type){
		var sum=0;
		data.allItems[type].forEach(function(cur){
			sum+=cur.value;
		});
		data.totals[type]=sum;
	};
	var data={
		allItems:{
			inc:[],
			exp:[]
		},
		totals:{
			exp:0,
			inc:0
		},
		budget:0,
		percentage:-1
	};
	return {
		//create new ID
		//Create new Item based on 'inc' or 'exp'
		AddItem:function(type,des,val){
			var newItem,ID;
			if(data.allItems[type].length > 0){
			ID=data.allItems[type][data.allItems[type].length-1].id+1;
			}else{
				ID=0;
			}
			if(type==='exp')
			{
				newItem=new Expances(ID,des,val);
			}else if(type==='inc'){
				newItem=new Income(ID,des,val);
			}
			//Add item to the data structure
			data.allItems[type].push(newItem);
			//Return the Item
			return newItem;
		},
		DeleteItem:function(type,id){
			var ids,index;
			ids=data.allItems[type].map(function(current){
				return current.id;
			});
			index=ids.indexOf(id);

			if(index!==-1)
			{
				data.allItems[type].splice(index,1);
			}
		},
		CalculateBudget:function(){
			//1.Calculate total income and expenses.
			calculateTotal('exp');
			calculateTotal('inc');
			//2.Calculate the budget:income-expenses
			data.budget=data.totals.inc-data.totals.exp;
			//3.Calculate the percentage of income that we spent.
			if(data.totals.inc>0){
			data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
			}else{
				data.percentage=-1;
			}
		},
		calculatePercentages:function(){
			data.allItems.exp.forEach(function(cur){
				cur.calcPercentages(data.totals.inc);
			});
		},
		getPercentages:function(){
			var allPerc=data.allItems.exp.map(function(cur){
				return cur.getPercentage();
			});
				return allPerc;
		},
		getBudget:function(){
			return{
				Budget:data.budget,
				totalInc:data.totals.inc,
				totalExp:data.totals.exp,
				percentBudget:data.percentage
			};
		},
		testing:function(){
			console.log(data);
		}
	}
})();
//UICONTROLLER
var UIcontroller=(function(){
	var DOMString={
		Inputtype:".add__type",
		Inputdescription:".add__description",
		Inputvalue:".add__value",
		Inputbtn:".add__btn",
		incomeInput:".income__list",
		expenseInput:".expenses__list",
		budgetLabel:".budget__value",
		incomeLabel:".budget__income--value",
		expenseLabel:".budget__expenses--value",
		percentageLabel:".budget__expenses--percentage",
		container:".container",
		expensePercentageLabel:".item__percentage",
		dateLabel:".budget__title--month"
	};
	var NumberFormat=function(num,type){
			//+ or - before number.
			var numSplit,int,dec;
			num=Math.abs(num);
			num=num.toFixed(2);
			//Two digit afterdecimal part.
			//Use comma if num is greater than 1000.
			numSplit=num.split(".");
			int=numSplit[0];

			if(int.length>3){
				int=int.substr(0,int.length-3)+","+int.substr(int.length-3,3);
			}
			dec=numSplit[1];
			return (type==='inc'?'+':'-')+' '+int+"."+dec;
	};
	var NodelistForEach=function(list,callback){
				for(var i=0;i<list.length;i++){
					callback(list[i],i);
				}
	};
	return {
		getInput:function(){
			return{
				type:document.querySelector(DOMString.Inputtype).value,
				description: document.querySelector(DOMString.Inputdescription).value,
				value:parseFloat( document.querySelector(DOMString.Inputvalue).value)
			};
		},
		addListItem:function(obj,type){
			var html,newhtml,element;
			//Create HTML string with placeholder text.
			if(type==='inc'){
			element=DOMString.incomeInput;	
			html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">x</i></button></div></div></div>';
			}
			else if(type==='exp')
			{
				element=DOMString.expenseInput;
			html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">x</i></button></div></div></div>';
			}
			//Replace the placeholder with some actual data.
			newhtml=html.replace("%id%",obj.id);
			newhtml=newhtml.replace("%description%",obj.description);
			newhtml=newhtml.replace("%value%",NumberFormat(obj.value,type));
			//Insert the HTML into DOM.
			document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
		},
		getDOMString:function(){
		return DOMString;
		},
		displayBudget:function(obj){
			var type;
			obj.Budget>0?type='inc':type='exp';
			document.querySelector(DOMString.budgetLabel).textContent=NumberFormat(obj.Budget,type);
			document.querySelector(DOMString.incomeLabel).textContent=NumberFormat(obj.totalInc,'inc');
			document.querySelector(DOMString.expenseLabel).textContent=NumberFormat(obj.totalExp,'exp');
			

			if(obj.percentBudget>0){
				document.querySelector(DOMString.percentageLabel).textContent=obj.percentBudget+"%";
			}else{
				document.querySelector(DOMString.percentageLabel).textContent="---";
			}
		},
		displayPercentages:function(percent){
			var fields=document.querySelectorAll(DOMString.expensePercentageLabel);

			NodelistForEach(fields,function(current,index){
			if(percent[index]>0){
				current.textContent=percent[index]+"%";
			}else{
				current.textContent="---";
				}
			});		
		},
		DisplayMonth:function(){
			var now,month,year,months;
			months=["January","February","March","April","May","June","July","August","September","October","November","December"];
			now=new Date();
			month=now.getMonth();
			year=now.getFullYear();
			document.querySelector(DOMString.dateLabel).textContent=months[month]+" "+year;
		},
		deleteListItem:function(selectorId){

			var el=document.getElementById(selectorId);
			el.parentNode.removeChild(el);
		},
		changedType:function(){
			var fields=document.querySelectorAll(
				DOMString.Inputtype+","+
				DOMString.Inputdescription+","+
				DOMString.Inputvalue);
			NodelistForEach(fields,function(cur){
				cur.classList.toggle("red-focus");
			})},
		fieldClear:function(){
			var field,arrayfield;
			field=document.querySelectorAll(DOMString.Inputdescription+', '+DOMString.Inputvalue);
			arrayfield=Array.prototype.slice.call(field);
			arrayfield.forEach(function(current,index,aray){
				current.value="";
			});
			arrayfield[0].focus();
		}
	};
})();
//GLOBAL APP CONTROLLER
var controller=(function(budgCntl,UIcntl){
	var setupEventListener=function(){
		var DOM=UIcntl.getDOMString();
		document.querySelector(DOM.Inputbtn).addEventListener("click",cntlAddItem);
		document.addEventListener("keypress",function(event){
		if(event.keypress===13 || event.which===13){
			cntlAddItem();
			}
		});
		document.querySelector(DOM.container).addEventListener("click",cntlDeleteItem);
		document.querySelector(DOM.Inputtype).addEventListener("change",UIcntl.changedType);
	};
	var updateBudget=function(){
		//1.Calculate the Budget.
		budgCntl.CalculateBudget();
		//2.Return the Budget.
		var Budget=budgCntl.getBudget();
		//3.Display the Budget.
		UIcntl.displayBudget(Budget);
	};
	var updatePercentage=function(){
		//1.Calculate percentage.
		budgCntl.calculatePercentages();
		//2.Read percentage from budget Controller.
		var percent=budgCntl.getPercentages();
		//3.Update the UI with new percentage.
		UIcntl.displayPercentages(percent);
	};
	var cntlAddItem = function(){
		var input,newItem;
		//1.Get the filled input data.
		input=UIcntl.getInput();	
		if(input.description!=="" && !isNaN(input.value) && input.value>0){
		//2.Add the data into budgetController
		newItem=budgCntl.AddItem(input.type,input.description,input.value);
		//3.Display the data into UI
		UIcntl.addListItem(newItem,input.type);
		//4.Clear the field.
		UIcntl.fieldClear();
		//5.Calculate and display the budget.
		updateBudget();
		//6.Calculate and Update Percentages.
		updatePercentage();
		}	
	};
	var cntlDeleteItem=function(event){
		var itemId,splitId,type,ID;
		itemId=event.target.parentNode.parentNode.parentNode.id;
		if(itemId)
		{
			splitId=itemId.split("-");
			type=splitId[0];
			ID=parseInt(splitId[1]);
			//1.Delete the item from the data structure.
			budgCntl.DeleteItem(type,ID);
			//2.Delete the Item from the UI.
			UIcntl.deleteListItem(itemId);
			//3.Update and show new budget.
			updateBudget();
			//4.Calculate and Update Percentages.
			updatePercentage();
		}
	};
	return {
		init:function(){
			UIcntl.DisplayMonth();
			console.log("application has stared");
			UIcntl.displayBudget({
				Budget:0,
				totalInc:0,
				totalExp:0,
				percentBudget:-1});
			setupEventListener();
		}
	}
})(budgetController,UIcontroller); 
controller.init();






