<template>
  <div class="container container-table">
    <div>
      <router-link to="/register">
        <a class="btn btn-default btn-w-sm btn-upper btn-outline hidden-xs pull-right">
          Get Started
        </a>
        <a class="btn btn-link pull-right">
          Need an account?
        </a>
      </router-link>
    </div>

    <div class="row vertical-10p">
      <div class="container">
        <img src="/static/img/white_logo_transparent_no_container_no_slogan.png" class="center-block login logo">

        <!--<div class="page-header">-->
          <!--<h1 style="text-align: center;">Login to appy</h1>-->
        <!--</div>-->

        <div v-if="loading" class="content content-centered">
          <pulse-loader></pulse-loader>
        </div>

        <div v-else>
          <div class="row">
            <div class="flash-message col-md-4 col-md-offset-4 text-center" v-if="flash">
              <div class="alert" :class="'alert-' + flashType">{{ flashMessage }}</div>
            </div>
          </div>

          <div v-if="accountActive" class="text-center col-md-4 col-md-offset-4">
            <div id="firebaseui-auth-container"></div>
          </div>

          <div v-if="!accountActive && !emailSent" class="text-center col-md-4 col-md-offset-4">
            <vue-form class="ui form" :state="formstate" @submit.prevent="sendActivationEmail">
              <validate auto-label :class="fieldClassName(formstate.email)" :debounce="250" :custom="{ email: emailValidator }">
                <vue-form-input
                  class="input-group"
                  required
                  v-model="email"
                  :formstate="formstate"
                  :type="'email'"
                  :name="'email'"
                  :placeholder="'Email'"
                  :messages="{ required: 'This field is required', email: 'Please input a valid email' }">
                  <span class="input-group-addon"><i class="fa fa-envelope"></i></span>
                </vue-form-input>
              </validate>

              <div class="content-centered">
                <button type="submit" class="btn btn-primary btn-lg" style="margin-top: 15px;"
                        :disabled="formstate.$invalid">Send Activation Email</button>
              </div>
            </vue-form>
          </div>

          <div v-if="!accountActive && emailSent" class="content-centered">
            <router-link to="/login">
              <button class="btn btn-primary" style="margin-top: 15px;">
                Proceed to Login
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { authService, formService } from '../../../services'
  import config from '../../../config'

  import firebase from 'firebase';
  import * as firebaseui from 'firebaseui'
  import {firebaseConfig} from '../../../../firebaseConfig';


  //TODO: Import test users
  const testUsers = ['test@superadmin.com', 'test@admin.com']

  export default {
    name: 'Login',
    data () {
      return {
        loading: false,
        formstate: {},
        flash: false,
        flashType: null,
        flashMessage: '',
        accountActive: true,
        emailSent: false,
        email: '',
        password: '',
        authUIConfig: null,
        authUI: null,
      }
    },
    mounted() {
      this.setAuthUI();
      this.startAuthUI();
    },
    computed: {
      // The '/auth/{social}' endpoint will first authenticate the user using the third party
      // social authentication, then the appy server will redirect us to the '/login/social/' view
      loginFacebookURI () {
        return config.serverURI + '/auth/facebook'
      },
      loginGoogleURI () {
        return config.serverURI + '/auth/google'
      },
      loginGithubURI () {
        return config.serverURI + '/auth/github'
      }
    },
    methods: {
      fieldClassName: formService.fieldClassName,
      emailValidator: formService.emailValidator,
      login ({ email, password, idToken, displayName }) {
        this.loading = true

        return authService.login({ email, password, idToken, displayName })
          .then(response => {
            this.loading = false
            this.$snotify.success('Login successful', 'Success!')
            this.$router.push('/')
          })
          .catch(error => {
            this.loading = false
            console.error('Login.login-error:', error)
            this.flash = true
            this.flashType = 'error'
            if (error.data.message === 'Invalid Email or Password.') {
              this.flashMessage = error.data.message
            } else if (error.data.message === 'Account is inactive.') {
              this.accountActive = false
              this.flashType = 'info'
              this.flashMessage = 'You need to activate your account. Please enter your email address and ' +
                'click the link below to resend an activation email.'
            } else if (error.data.message === 'Account is disabled.') {
              this.flashMessage = 'Your account has been disabled. Please contact the SuperAdmin ' +
                'to enable your account.'
            } else if (error.data.message === 'Account is deleted.') {
              this.flashMessage = 'This account has been deleted'
            } else if (error.data.message === 'Maximum number of auth attempts reached. Please try again later.') {
              this.flashMessage = error.data.message
            } else {
              this.flashMessage = 'There was an error logging in, please try again.'
            }
          })
      },
      sendActivationEmail () {
        this.loading = true
        authService.sendActivationEmail(this.email)
          .then((response) => {
            this.loading = false
            this.emailSent = true
            this.flash = true
            this.flashType = 'success'
            this.flashMessage = 'Message sent. Please check your email for an account activation link.'
          })
          .catch((error) => {
            console.error('Login.sendActivationEmail-error:', error)
            this.loading = false
            this.flash = true
            this.flashType = 'error'
            // NOTE: For more secure applications, the server should respond with a success even if the user isn't found
            // since this reveals the existence of an account. For more information, refer to the links below:
            // https://postmarkapp.com/guides/password-reset-email-best-practices
            // https://security.stackexchange.com/questions/40694/disclose-to-user-if-account-exists
            if (error.data.message === 'User not found.') {
              this.flashMessage = 'No account was found with that email.'
            } else {
              this.flashMessage = 'There was an error sending the email. ' +
                'Please try again or contact us if you continue to have trouble creating an account.'
            }
          })
      },
      setAuthUI () {
        this.authUIConfig = {
          callbacks: {
            signInSuccessWithAuthResult: this.signInSuccessWithAuthResult,
            uiShown: this.uiShown
          },
          signInFlow: 'popup',
          signInOptions: [
            {
              provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
              signInMethod: firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
              requireDisplayName: true,
            },
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          ],
        };
        this.authUI = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
        let self = this;
      },
      startAuthUI () {
        this.authUI.start('#firebaseui-auth-container', this.authUIConfig);
      },
      uiShown () {
        // Grab the password for login to support super admin login
        const submitButton = document.getElementsByClassName('firebaseui-id-submit')[0];
        const emailInput = document.getElementsByClassName('firebaseui-id-email')[0];
        const passwordInput = document.getElementsByClassName('firebaseui-id-password')[0];
        if (submitButton && passwordInput && emailInput) {
          submitButton.onclick = async e => {
            if (testUsers.includes(emailInput.value)) {
              e.stopPropagation();
              this.login({ email: emailInput.value, password: passwordInput.value });
            }
          };
        }
        return false;
      },
      signInSuccessWithAuthResult (result) {
        this.handleSignIn(result)
        return false;
      },
      async handleSignIn (result) {
        const idToken = await firebase.auth().currentUser.getIdToken();
        const { displayName } = firebase.auth().currentUser;

        let { emailVerified } = result.user;

        emailVerified && (await this.login({ idToken, displayName }));

        if (!emailVerified && !testUsers.includes(firebase.auth().currentUser.email)) {
          await firebase
            .auth()
            .currentUser.sendEmailVerification()
          
          this.flash = true
          this.flashType = 'info'
          this.flashMessage = 'You need to activate your account. An activation email has been sent to your address.'

          await firebase.auth().signOut();
          this.startAuthUI()
        }
      }
    },
    created () {
      this.email = this.$route.query.email || ''
      this.password = this.$route.query.password || ''
    }
  }
</script>

<style lang="scss">
  html, body, .container-table {
    height: 100%;
    background-color: #282B30 !important;
  }
  .container-table {
      display: table;
      color: white;
  }
  .vertical-center-row {
      display: table-cell;
      vertical-align: middle;
  }
  .vertical-20p {
    padding-top: 20%;
  }
  .vertical-10p {
    padding-top: 10%;
  }
  .login.logo {
    width: 20em;
    padding: 3em;
  }
  .loginForm .input-group {
    padding-bottom: 1em;
    height: 4em;
  }
  .input-group input {
    height: 4em;
  }
  .btn-outline:hover {
    color: #333333;
  }


</style>
