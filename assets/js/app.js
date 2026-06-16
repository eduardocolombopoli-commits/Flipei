/* =========================================================================
   FLIPEI — Bootstrap
   ========================================================================= */
(function init(){
  // keep FX canvas sized
  window.addEventListener('resize', ()=>{
    const c = document.getElementById('fx-canvas');
    if(c){ c.width = innerWidth; c.height = innerHeight; }
  });
  // initial route
  App.role = 'aluno';
  App.route = 'splash';
  render();
})();
