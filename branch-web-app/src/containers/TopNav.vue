<template>
  <nav class="navbar fixed-top">
    <div class="d-flex align-items-center navbar-left">
      <a href="#" class="menu-button d-none d-md-block" @click.prevent="changeSideMenuStatus({step :menuClickCount+1,classNames:menuType,selectedMenuHasSubItems})">
        <menu-icon />
      </a>
      <a href="#" class="menu-button-mobile d-xs-block d-sm-block d-md-none" @click.prevent="changeSideMenuForMobile(menuType)">
        <mobile-menu-icon />
      </a>
    </div>
    <router-link class="navbar-logo" to="/">
      <span class="logo d-block" />
    </router-link>

    <div class="navbar-right">
      <div class="header-icons d-inline-block align-middle">
        <div class="user d-inline-block">
          <div class="dropdown">
            <button class="btn btn-empty p-0 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <span>
                <img :alt="currentUser.email" :src="currentUser.photoUrl || defaultProfilePicture ">
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <button class="btn btn-link dropdown-item" @click="logout">
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import defaultProfilePicture from "../assets/img/profile-pic-2.jpg"
import {
    mapGetters,
    mapMutations,
    mapActions
} from 'vuex'
import {
    MenuIcon,
    MobileMenuIcon
} from '../components/Svg'
import {
    searchPath,
    menuHiddenBreakpoint,
    buyUrl,
    defaultColor
} from '../constants/config'
import {
    getDirection,
    setDirection
} from '../utils'
export default {
    components: {
        'menu-icon': MenuIcon,
        'mobile-menu-icon': MobileMenuIcon,
    },
    data() {
        return {
            selectedParentMenu: '',
            searchKeyword: '',
            isMobileSearch: false,
            isSearchOver: false,
            fullScreen: false,
            menuHiddenBreakpoint,
            searchPath,
            buyUrl,
            isDarkActive: false,
            defaultProfilePicture
        }
    },
    computed: {
        ...mapGetters({
            currentUser: 'currentUser',
            menuType: 'getMenuType',
            menuClickCount: 'getMenuClickCount',
            selectedMenuHasSubItems: 'getSelectedMenuHasSubItems'
        })
    },
    // created() {
    //     const color = this.getThemeColor()
    //     this.isDarkActive = color.indexOf('dark') > -1
    // },
    watch: {
        '$i18n.locale'(to, from) {
            if (from !== to) {
                this.$router.go(this.$route.path)
            }
        },
        // isDarkActive(val) {
        //     let color = this.getThemeColor()
        //     let isChange = false
        //     if (val && color.indexOf('light') > -1) {
        //         isChange = true
        //         color = color.replace('light', 'dark')
        //     } else if (!val && color.indexOf('dark') > -1) {
        //         isChange = true
        //         color = color.replace('dark', 'light')
        //     }
        //     if (isChange) {
        //         localStorage.setItem('themeColor', color)
        //         setTimeout(() => {
        //             window.location.reload()
        //         }, 500)
        //     }
        // },
        isMobileSearch(val) {
            if (val) {
                document.addEventListener('click', this.handleDocumentforMobileSearch)
            } else {
                document.removeEventListener(
                    'click',
                    this.handleDocumentforMobileSearch
                )
            }
        }
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleDocumentforMobileSearch)
    },
    methods: {
        ...mapMutations(['changeSideMenuStatus', 'changeSideMenuForMobile']),
        ...mapActions(['setLang', 'signOut']),
        search() {
            this.$router.push(`${this.searchPath}?search=${this.searchKeyword}`)
            this.searchKeyword = ''
        },
        searchClick() {
            if (window.innerWidth < this.menuHiddenBreakpoint) {
                if (!this.isMobileSearch) {
                    this.isMobileSearch = true
                } else {
                    this.search()
                    this.isMobileSearch = false
                }
            } else {
                this.search()
            }
        },
        handleDocumentforMobileSearch() {
            if (!this.isSearchOver) {
                this.isMobileSearch = false
                this.searchKeyword = ''
            }
        },

        changeLocale(locale, direction) {
            const currentDirection = getDirection().direction
            if (direction !== currentDirection) {
                setDirection(direction)
            }

            this.setLang(locale)
        },
        logout() {
            this.signOut().then(() => {
                this.$router.push('/user/login')
            })
        },
        getThemeColor() {
            return localStorage.getItem('themeColor') ?
                localStorage.getItem('themeColor') :
                defaultColor
        },
        isInFullScreen() {
            return (
                (document.fullscreenElement && document.fullscreenElement !== null) ||
                (document.webkitFullscreenElement &&
                    document.webkitFullscreenElement !== null) ||
                (document.mozFullScreenElement &&
                    document.mozFullScreenElement !== null) ||
                (document.msFullscreenElement && document.msFullscreenElement !== null)
            )
        }
    }
}
</script>
