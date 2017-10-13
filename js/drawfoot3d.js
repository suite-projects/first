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
      camera.position.z = 390;
      /*
      camera.quaternion
      camera.rotation
      camera.scale
      camera.up
      */

      //scene
      scene = new THREE.Scene();
      //light
      light = new THREE.DirectionalLight(0xFFFFFF, 0.5, 0);
      scene.add(light);
      light2 = new THREE.AmbientLight(0x111111);
      //light2 = new THREE.AmbientLight(0x333333);
      scene.add(light2);

      addObjectSTL(code,1);
      addObjectSTL(code,2);
      trackball = new THREE.TrackballControls( camera, renderer.domElement );
      loop();
  }
  function addObjectSTL(code,which){
      var footside,msgdiv_id;
      if(which == 1){
        footside = "左足";
        msgdiv_id = "loadmsg"+String(which);
      }else{
        footside = "右足";
      }
      $("#info").append("<div id='"+msgdiv_id+"'></div>");
      var loader = new THREE.STLLoader();
      var url = location.href;
      var tmp = url.split("/");
      tmp.pop();
      
      url = tmp.join("/");
      var src=url+"/?page=detail&act=getstl&mc="+String(code)+"&w="+String(which);
      loader.addEventListener( 'progress', function ( event ) {
        $("#"+msgdiv_id).html(footside+"読み込み中:"+event.loaded+"/"+event.total);
      });
      loader.addEventListener( 'error', function ( event ) {
        $("#info").html("読み込みエラー");
      });
      loader.addEventListener( 'load', function ( event ) {
        var geometry = event.content;
        geometry.computeFaceNormals();
        /*
        material = new THREE.MeshBasicMaterial({
          color: 0xdddddd,
          wireframe: true
        } );
        */
        material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          specular: 0xcccccc,
          shininess:50,
          ambient: 0xffffff
        });
        material.doubleSided = true;
        material.side = THREE.DoubleSide;
        mesh = new THREE.Mesh( geometry,material);
        mesh.doubleSided = true;
        if(which == 1){
          mesh.position.x -= Number(70);
          mesh.position.y -= Number(120);
        }else{
          mesh.position.x += Number(70);
          mesh.position.y -= Number(120);
        }
        scene.add(mesh);
      } );
      loader.load(src);
  }

   function loop() {
      light.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z
      );

      if(scene.children.length == 5){
        $("#info").html("");
      }
      camera.lookAt( {x:0, y:0, z:0 } );
      //renderer.clear();
      trackball.update();
      renderer.render(scene, camera);

      window.requestAnimationFrame(loop);

  }


