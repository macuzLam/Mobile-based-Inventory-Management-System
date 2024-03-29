angular.module('fyp.services', [])

  .factory('apiService', function ($http) {
    var config = {
      apiKey: "AIzaSyDHe6gxO-a11EPWAzq6AecIKl7HCVTi_Io",
      authDomain: "fypproject-ad9a3.firebaseapp.com",
      databaseURL: "https://fypproject-ad9a3.firebaseio.com",
      projectId: "fypproject-ad9a3",
      storageBucket: "fypproject-ad9a3.appspot.com",
      messagingSenderId: "1050291216770"
    };
    firebase.initializeApp(config);
    var db = firebase.firestore();
    var apiUrl = "http://localhost:9000/";
    return {
      genUUID: function () {
        var d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
          d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
      },

      getUserList: function () {

        return db.collection("users").get().then((querySnapshot) => {
          var data = [];
          querySnapshot.forEach((doc) => {
            data.push(_.extend({ userId: doc.id }, doc.data()));
          });
          console.log("getUserList finished")
          return data;
        });
        // return $http({
        //   method: "GET",
        //   url: apiUrl + "users",
        //   headers: {
        //     'Content-Type': 'application/json; charset=utf-8'
        //   }
        // }).then(function mySucces(response) {
        //   console.log(response);
        //   return response;
        // }, function myError(response) {

        // })
      },
      getUserById: function (_userId) {
        return db.collection("users").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (_userId == doc.id) {
              return doc.data();
            }
          });
        })
        // return $http({
        //   method: "GET",
        //   url: apiUrl + "users/" + _userId,
        //   headers: {
        //     'Content-Type': 'application/json; charset=utf-8'
        //   }
        // }).then(function mySucces(response) {
        //   // console.log(response);
        //   return response;
        // }, function myError(response) {

        // })
      },
      createNewUser: function (createUserform) {
        return db.collection("users").add({
          username: createUserform.username,
          password: createUserform.password,
          role: createUserform.role,
          email: createUserform.email,
          phone: createUserform.phone
        })
          .then(function (docRef) {
            return console.log("userId: " + docRef.id + " created!");
          });

        // console.log(nextUserId);
        // return $http({
        //   method: "POST",
        //   url: apiUrl + "users",
        //   data: {
        //     userId: nextUserId,
        //     username: createUserform.username,
        //     password: createUserform.password,
        //     role: createUserform.role,
        //     email: createUserform.email,
        //     phone: createUserform.phone
        //   },
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   }
        // }).then(function mySucces(response) {
        //   // console.log(response);
        //   return response;
        // }, function myError(response) {

        // })
      },
      deleteUser: function (_userId) {
        console.log(_userId);
        return db.collection("users").doc(_userId).delete().then(function () {
          return console.log(_userId + "successfully deleted!");
        }).catch(function (error) {
          return console.error("Error removing document: ", error);
        });
      },
      updateUser: function (_userId, editUserForm) {
        var data;
        if (editUserForm.newPassword == '' || editUserForm.newPassword == null) {
          data = {
            username: editUserForm.username,
            email: editUserForm.email
          }
        } else {
          data = {
            username: editUserForm.username,
            password: editUserForm.newPassword,
            email: editUserForm.email
          }
        }

        return db.collection("users").doc(_userId).update(data)
          .then(function () {
            return console.log("userId: " + _userId + " edited!");
          });
      },
      updateUserAdmin: function (_userId, editUserForm) {
        var data;
        if (editUserForm.newPassword == '' || editUserForm.newPassword == null) {
          data = {
            username: editUserForm.username,
            email: editUserForm.email,
            phone: editUserForm.phone,
            role: editUserForm.role
          }
        } else {
          data = {
            username: editUserForm.username,
            password: editUserForm.newPassword,
            email: editUserForm.email,
            phone: editUserForm.phone,
            role: editUserForm.role
          }
        }

        return db.collection("users").doc(_userId).update(data)
          .then(function () {
            return console.log("userId: " + _userId + " edited!");
          });
      },

      getInventoryList: function () {
        return db.collection("inventories").get().then((querySnapshot) => {
          var data = [];
          querySnapshot.forEach((doc) => {
            data.push(_.extend({ itemId: doc.id }, doc.data()));
          });
          return data;
        });
        // return $http({
        //   method: "GET",
        //   url: apiUrl + "inventories",
        //   headers: {
        //     'Content-Type': 'application/json; charset=utf-8'
        //   }
        // }).then(function mySucces(response) {
        //   // console.log(response);
        //   return response;
        // }, function myError(response) {

        // })
      },
      getInventoryById: function (_itemId) {
        return db.collection("inventories").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (_itemId == doc.id) {
              return doc.data();
            }
          });
        })
      },
      getInventoryByProductId: function (_productId) {
        return db.collection("inventories").where("productId", "==", _productId)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              return doc.data();
            });
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      },
      createNewInventory: function (createInventoryform) {
        return db.collection("inventories").add({
          productId: createInventoryform.productId,
          iName: createInventoryform.iName,
          price: createInventoryform.price,
          checkInTime: moment().format(),
          location: createInventoryform.location,
          beacon: createInventoryform.beacon,
          status: "Available"
        })
          .then(function (docRef) {
            return console.log("itemId: " + docRef.id + " created!");
          });

        // console.log(nextItemId);
        // return $http({
        //   method: "POST",
        //   url: apiUrl + "inventories",
        //   // withCredentials: true,
        //   data: {
        //     itemId: nextItemId,
        //     productId: "4987241148622",
        //     iName: createInventoryform.iName,
        //     checkInTime: createInventoryform.checkInTime,
        //     distance: 0,
        //     status: "Available",
        //     price: createInventoryform.price
        //   },
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   }
        // }).then(function mySucces(response) {
        //   // console.log(response);
        //   return response;
        // }, function myError(response) {

        // })
      },
      updateInventory: function (_editInventoryform) {
        var data;

        if (_editInventoryform.beacon == "" || _editInventoryform.beacon == null) {
          data = {
            beacon: "",
            iName: _editInventoryform.iName,
            price: _editInventoryform.price,
            location: _editInventoryform.location,
          }
        } else {
          data = {
            beacon: _editInventoryform.beacon,
            iName: _editInventoryform.iName,
            price: _editInventoryform.price,
            location: _editInventoryform.location,
          }
        }



        return db.collection("inventories").doc(_editInventoryform.itemId).update(data)
          .then(function () {
            return console.log("itemId: " + _editInventoryform.itemId + " edited!");
          });
      },

      deleteItem: function (_itemId) {
        console.log(_itemId);
        return db.collection("inventories").doc(_itemId).delete().then(function () {
          return console.log(_itemId + "successfully deleted!");
        }).catch(function (error) {
          return console.error("Error removing document: ", error);
        });
      },

      createOrder: function (_itemId,_productId, _userId) {
        console.log("productId: " + _productId + " userId: " + _userId)
        return db.collection("orders").add({
          itemId: _itemId,
          productId: _productId,
          userId: _userId,
          orderTime: moment().format(),
          orderStatus: "Pending",
          employee: ""
        })
          .then(function (docRef) {
            return console.log("orderId: " + docRef.id + " created!");
          });
      },
      getOrderList: function () {

        return db.collection("orders").get().then((querySnapshot) => {
          var data = [];
          querySnapshot.forEach((doc) => {
            data.push(_.extend({ orderId: doc.id }, doc.data()));
          });
          console.log("getOrderList finished")
          return data;
        });
        // return $http({
        //   method: "GET",
        //   url: apiUrl + "users",
        //   headers: {
        //     'Content-Type': 'application/json; charset=utf-8'
        //   }
        // }).then(function mySucces(response) {
        //   console.log(response);
        //   return response;
        // }, function myError(response) {

        // })
      },
      updateOrderStatus: function (_orderId, _status) {
        var data;
        data = {
          orderStatus: _status,
        }

        return db.collection("orders").doc(_orderId).update(data)
          .then(function () {
            return console.log("orderId: " + _orderId + " edited!");
          });
      },
      getMessageList: function () {
        return db.collection("messages").get().then((querySnapshot) => {
          var data = [];
          querySnapshot.forEach((doc) => {
            data.push(_.extend({ messageId: doc.id }, doc.data()));
          });
          console.log("getMessageList finished")
          return data;
        });
      },
      createMessage: function (_title,_message, _orderId, _userId) {
        return db.collection("messages").add({
          title: _title,
          content: _message,
          orderId: _orderId,
          messageTime: moment().format(),
          refId: '',
          stack: 0,
          userId: _userId
        })
          .then(function (docRef) {
            return console.log("message: " + docRef.id + " created!");
          });
      },
      replyMessage: function (_message, _stack, _userId, _refId, _orderId) {
        return db.collection("messages").add({
          title: "",
          content: _message,
          orderId: _orderId,
          messageTime: moment().format(),
          refId: _refId,
          stack: _stack,
          userId: _userId
        })
          .then(function (docRef) {
            return console.log("message: " + docRef.id + " created!");
          });
      },
      updateInventoryStatus: function (_itemId, _status) {
        var data;
        data = {
          status: _status,
        }

        return db.collection("inventories").doc(_itemId).update(data)
          .then(function () {
            return console.log("itemId: " + _itemId + " edited!");
          });
      },

    }
  })

  .directive('hideTabs', function ($rootScope) {
    return {
      restrict: 'A',
      link: function ($scope, $el) {
        $rootScope.hideTabs = 'tabs-item-hide';
        $scope.$on('$destroy', function () {
          $rootScope.hideTabs = '';
        });
      }
    };
  });
