using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Firebase.Auth;
using Firebase;
using RNCConfig;
using Microsoft.ReactNative.Managed;

namespace zansshootingsimulator.Firebase
{
    [ReactModule("FirebaseService")]
    public class FirebaseService
    {
        private string _apiKey;
        private string _googleAccessToken;
        private FirebaseAuthType _authType;
        private FirebaseAuthProvider _provider;

        public FirebaseService()
        {
        }

        public async void GoogleSignIn(ReactPromise<JSValue> promise)
        {
            _authType = FirebaseAuthType.Google;



        }
    }
}
