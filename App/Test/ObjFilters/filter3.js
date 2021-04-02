let arrayA=[
    {id: "abdc4051", date: "2017-01-24"},
    {id: "abdc4052", date: "2017-01-22"}]
    
    let arrayB=[
    {id: "abdc4051", name: "ab"},
    {id: "abdc4052", name: "abc"}]
    
    let arrayC = [];
    
    
    function isBiggerThan10(element, index, array) {
      return element > 10;
    }
    
    arrayA.forEach(function(element){
      arrayC.push({
      id:element.id,
      date:element.date,
      name:(arrayB.find(e=>e.id===element.id)).name
      });  
    });
    
    console.log(arrayC);
    
    //0:{id: "abdc4051", date: "2017-01-24", name: "ab"}
    //1:{id: "abdc4052", date: "2017-01-22", name: "abc"}