/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
  var width, height;
  var renderer;
  var TgObj
  var camera;
  var scene;
  var light, light2;
  var mesh;

  // revolutions per second
  var angularSpeed = 0.2; 
  var lastTime = 0;

  function Start3D(code){
      TgObj = $("#drawarea");

      width = TgObj.width();
      height = TgObj.height();
      try {
          renderer = new THREE.WebGLRenderer({antialias: false});
      }catch(e){
          TgObj.html("ブラウザがＷｅｂＧＬに対応していないか、ＧＰＵがＯｐｅｎＧＬ２／ＥＳに対応していません。");
          return false;
      }

      renderer.setSize(width, height);
      TgObj.append(renderer.domElement);
      renderer.setClearColorHex(0x2255dd, 1.0);

      //camera
      camera = new THREE.PerspectiveCamera(45, width / height , 1 , 10000 );
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 360;
      //scene
      scene = new THREE.Scene();
      //light
      light = new THREE.DirectionalLight(0xFFFFFF, 0.5, 0);
      scene.add(light);
      light2 = new THREE.AmbientLight(0x111111);
      //light2 = new THREE.AmbientLight(0x333333);
      scene.add(light2);

      addObjectSTL(code);
      trackball = new THREE.TrackballControls( camera, renderer.domElement );
      loop();
  }
  function addObjectSTL(code){
      var loader = new THREE.STLLoader();
      var url = location.href;
      var tmp = url.split("/");
      var siz = 0;
      tmp.pop();
      url = tmp.join("/");
      var src=url+"/?page=detail&act=getstl&id="+String(code);
      loader.addEventListener( 'progress', function ( event ) {
        siz = event.total;
        $("#info").html("読み込み中:"+event.loaded+"/"+event.total);
      });
      loader.addEventListener( 'error', function ( event ) {
        $("#info").html("読み込みエラー");
      });
      loader.addEventListener( 'load', function ( event ) {
        var geometry = event.content;
        geometry.normalsNeedUpdate = true;
        geometry.computeBoundingBox();
        material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          specular: 0xcccccc,
          shininess:50,
          ambient: 0xffffff
        });
        material.doubleSided = true;
        material.side = THREE.DoubleSide;
        mesh = new THREE.Mesh( geometry, material);
        mesh.doubleSided = true;
        scene.add(mesh);
        
        mesh.position.setX(-100);
        mesh.position.setY(130);

        $("#info").html("サイズ："+siz);
        $("#info").html("");
        loop();
        //animate();
      } );
      loader.load(src);
      
  }

   function loop() {
      light.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z
      );

      camera.lookAt( {x:0, y:0, z:0 } );
      renderer.clear();
      trackball.update();
      renderer.render(scene, camera);

      window.requestAnimationFrame(loop);
  }

  // this function is executed on each animation frame
  function animate(){
    // update
    var time = (new Date()).getTime();
    var timeDiff = time - lastTime;
    var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
    cube.rotation.y += angleChange;
    lastTime = time;

    // render
    renderer.render(scene, camera);

    // request new frame
    requestAnimationFrame(function(){
        animate();
    });
  }

