<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <piaf-breadcrumb :heading="$t('menu.cards')" />
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xxs="12">
            <h5 class="mb-4 card-title">{{ $t('cards.icon-card') }}</h5>
            <b-row class="icon-cards-row mb-3">
                <b-colxx xxs="6" sm="4" md="3" lg="2">
                    <icon-card :title="$t('dashboards.pending-orders')" icon="iconsminds-clock" :value=14 />
                </b-colxx>
                <b-colxx xxs="6" sm="4" md="3" lg="2">
                    <icon-card :title="$t('dashboards.completed-orders')" icon="iconsminds-basket-coins" :value=32 />
                </b-colxx>
                <b-colxx xxs="6" sm="4" md="3" lg="2">
                    <icon-card :title="$t('dashboards.refund-requests')" icon="iconsminds-arrow-refresh" :value=74 />
                </b-colxx>
                <b-colxx xxs="6" sm="4" md="3" lg="2">
                    <icon-card :title="$t('dashboards.new-comments')" icon="iconsminds-mail-read" :value=25 />
                </b-colxx>
            </b-row>

            <h5 class="mb-4 card-title">{{ $t('cards.image-card') }}</h5>
            <b-row>
                <b-colxx xxs="12" xs="6" lg="4">
                    <b-card class="mb-4" no-body>
                        <div class="position-relative">
                            <img src="/assets/img/card-thumb-1.jpg" class="card-img-top" />
                            <b-badge variant="primary" pill class="position-absolute badge-top-left">NEW</b-badge>
                            <b-badge variant="secondary" pill class="position-absolute badge-top-left-2">TRENDING</b-badge>
                        </div>
                        <b-card-body>
                            <h6 class="mb-4 card-subtitle">Homemade Cheesecake with Fresh Berries and Mint</h6>
                            <p class="card-text text-muted text-small mb-0 font-weight-light">09.04.2018</p>
                        </b-card-body>
                    </b-card>
                </b-colxx>

                <b-colxx xxs="12" xs="6" lg="4" class="mb-3">
                    <b-card class="mb-4" no-body>
                        <b-card-body>
                            <h6 class="mb-4 card-subtitle">Homemade Cheesecake with Fresh Berries and Mint</h6>
                            <p class="card-text text-muted text-small mb-0 font-weight-light">09.04.2018</p>
                        </b-card-body>
                        <div class="position-relative">
                            <img src="/assets/img/card-thumb-1.jpg" class="card-img-top" />
                            <b-badge variant="primary" pill class="position-absolute badge-top-left">NEW</b-badge>
                            <b-badge variant="secondary" pill class="position-absolute badge-top-left-2">TRENDING</b-badge>
                        </div>
                    </b-card>
                </b-colxx>
            </b-row>

            <h5 class="mb-4 card-title">{{ $t('cards.image-overlay-card') }}</h5>
            <b-row>
                <b-colxx xxs="12" xs="6" lg="3" class="mb-3">
                    <b-card class="mb-4 text-white" no-body>
                        <img src="/assets/img/card-thumb-1.jpg" class="card-img" />
                        <div class="card-img-overlay">
                            <h5 class="card-title">Fruitcake</h5>
                            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
                        </div>
                    </b-card>
                </b-colxx>
            </b-row>

            <h5 class="mb-4 card-title">{{ $t('cards.image-card-list') }}</h5>
            <b-row>
                <b-colxx xxs="12">
                    <b-card class="d-flex flex-row mb-3" no-body>
                        <router-link to="?" class="d-flex">
                            <img alt="Thumbnail" src="/assets/img/chocolate-cake-thumb.jpg" class="list-thumbnail responsive border-0" />
                        </router-link>
                        <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                            <div class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                                <router-link to="?" class="w-40 w-sm-100">
                                    <p class="list-item-heading mb-1 truncate">Chocolate Cake</p>
                                </router-link>
                                <p class="mb-1 text-muted text-small w-15 w-sm-100">Cakes</p>
                                <p class="mb-1 text-muted text-small w-15 w-sm-100">09.04.2018</p>
                                <div class="w-15 w-sm-100">
                                    <b-badge variant="primary" pill>PROCESSED</b-badge>
                                </div>
                            </div>
                            <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                                <div class="custom-control custom-checkbox mb-0">
                                    <b-form-checkbox-group id="checkboxes2" name="flavour2" stacked>
                                        <b-form-checkbox value="orange" />
                                    </b-form-checkbox-group>
                                </div>
                            </div>
                        </div>
                    </b-card>
                </b-colxx>
                <b-colxx xxs="12" class="mb-3">
                    <b-card class="d-flex flex-row mb-4" no-body>
                        <router-link to="?" class="d-flex">
                            <img alt="Thumbnail" src="/assets/img/cheesecake-thumb.jpg" class="list-thumbnail responsive border-0" />
                        </router-link>
                        <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                            <div class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                                <router-link to="?" class="w-40 w-sm-100">
                                    <p class="list-item-heading mb-1 truncate">Cheesecake</p>
                                </router-link>
                                <p class="mb-1 text-muted text-small w-15 w-sm-100">Cupcakes</p>
                                <p class="mb-1 text-muted text-small w-15 w-sm-100">09.04.2018</p>
                                <div class="w-15 w-sm-100">
                                    <b-badge variant="secondary" pill>ON HOLD</b-badge>
                                </div>
                            </div>
                            <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                                <div class="custom-control custom-checkbox mb-0">
                                    <b-form-checkbox-group id="checkboxes2" name="flavour2" stacked>
                                        <b-form-checkbox value="orange" />
                                    </b-form-checkbox-group>
                                </div>
                            </div>
                        </div>
                    </b-card>
                </b-colxx>
            </b-row>

            <h5 class="mb-4 card-title">{{ $t('cards.tab-card') }}</h5>

            <b-row>
                <b-colxx xxs="12" xs="6" lg="6">
                    <b-card class="mb-4" no-body>
                        <b-tabs card no-fade>
                            <b-tab title="Tab 1" active>
                                <h5 class="mb-4 card-title">Homemade Cheesecake with Fresh Berries and Mint</h5>
                                <b-button size="sm" variant="outline-primary">Edit</b-button>
                            </b-tab>
                            <b-tab title="Tab 2">
                                <h5 class="mb-4 card-title">Wedding Cake with Flowers Macarons and Blueberries</h5>
                                <b-button size="sm" variant="outline-primary">Edit</b-button>
                            </b-tab>
                            <b-tab title="Tab 3">
                                <h5 class="mb-4 card-title">Cheesecake with Chocolate Cookies and Cream Biscuits</h5>
                                <b-button size="sm" variant="outline-primary">Edit</b-button>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                </b-colxx>

                <b-colxx xxs="12" xs="6" lg="6" class="mb-3">
                    <b-card class="mb-4" no-body>
                        <b-tabs card no-fade>
                            <b-tab title="Tab 1" active title-item-class="w-50 text-center">
                                <h5 class="mb-4 card-title">Homemade Cheesecake with Fresh Berries and Mint</h5>
                                <b-button size="sm" variant="outline-primary">Edit</b-button>
                            </b-tab>
                            <b-tab title="Tab 2" title-item-class="w-50 text-center">
                                <h5 class="mb-4 card-title">Wedding Cake with Flowers Macarons and Blueberries</h5>
                                <b-button size="sm" variant="outline-primary">Edit</b-button>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                </b-colxx>
            </b-row>

            <h5 class="mb-4 card-title">{{ $t('cards.user-card') }}</h5>
            <b-row>
                <b-colxx md="6" sm="6" lg="4" xxs="12">
                    <b-card class="mb-4 text-center">
                        <router-link to="?">
                            <img src="/assets/img/profile-pic-l.jpg" alt="Card image cap" class="img-thumbnail list-thumbnail rounded-circle border-0 mb-4" />
                            <h6 class="mb-1 card-subtitle">Sarah Kortney</h6>
                            <p class="text-muted text-small mb-4">Executive Director</p>
                        </router-link>
                        <b-button size="sm" variant="outline-primary">Edit</b-button>
                    </b-card>
                </b-colxx>

                <b-colxx md="6" sm="6" lg="4" xxs="12">
                    <b-card class="mb-4 d-flex flex-row" no-body>
                        <router-link to="?" class="d-flex">
                            <img src="/assets/img/profile-pic-l.jpg" alt="Card image cap" class="img-thumbnail list-thumbnail  rounded-circle align-self-center m-4" />
                        </router-link>
                        <div class=" d-flex flex-grow-1 min-width-zero">
                            <div class=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                <div class="min-width-zero">
                                    <router-link to="?">
                                        <h6 class="mb-1 card-subtitle truncate">Sarah Kortney</h6>
                                    </router-link>
                                    <p class="text-muted text-small mb-2">Executive Director</p>
                                    <b-button size="xs" variant="outline-primary">Edit</b-button>
                                </div>
                            </div>
                        </div>
                    </b-card>

                    <b-card class="mb-4 d-flex flex-row" no-body>
                        <router-link to="?" class="d-flex">
                            <div src="/assets/img/profile-pic-l.jpg" alt="Card image cap" class="align-self-center list-thumbnail-letters rounded-circle m-4">SK</div>
                        </router-link>
                        <div class=" d-flex flex-grow-1 min-width-zero">
                            <div class=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                <div class="min-width-zero">
                                    <router-link to="?">
                                        <h6 class="mb-1 card-subtitle truncate">Sarah Kortney</h6>
                                    </router-link>
                                    <p class="text-muted text-small mb-2">Executive Director</p>
                                    <b-button size="xs" variant="outline-primary">Edit</b-button>
                                </div>
                            </div>
                        </div>
                    </b-card>
                </b-colxx>

                <b-colxx md="6" sm="6" lg="4" xxs="12">
                    <b-card class="mb-4 d-flex flex-row" no-body>
                        <router-link to="?" class="d-flex">
                            <img src="/assets/img/profile-pic-l.jpg" alt="Card image cap" class="img-thumbnail list-thumbnail  rounded-circle align-self-center m-4 small" />
                        </router-link>
                        <div class=" d-flex flex-grow-1 min-width-zero">
                            <div class=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                <div class="min-width-zero">
                                    <router-link to="?">
                                        <h6 class="mb-1 card-subtitle truncate">Sarah Kortney</h6>
                                    </router-link>
                                    <p class="text-muted text-small mb-2">Executive Director</p>
                                </div>
                            </div>
                        </div>
                    </b-card>

                    <b-card class="mb-4 d-flex flex-row" no-body>
                        <router-link to="?" class="d-flex">
                            <div src="/assets/img/profile-pic-l.jpg" alt="Card image cap" class="align-self-center list-thumbnail-letters rounded-circle m-4 small">SK</div>
                        </router-link>
                        <div class=" d-flex flex-grow-1 min-width-zero">
                            <div class=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                <div class="min-width-zero">
                                    <router-link to="?">
                                        <h6 class="mb-1 card-subtitle truncate">Sarah Kortney</h6>
                                    </router-link>
                                    <p class="text-muted text-small mb-2">Executive Director</p>
                                </div>
                            </div>
                        </div>
                    </b-card>
                </b-colxx>
            </b-row>

        </b-colxx>
    </b-row>
</div>
</template>

<script>
import IconCard from '../../../../components/Cards/IconCard'

export default {
    components: {
        'icon-card': IconCard
    }
}
</script>
