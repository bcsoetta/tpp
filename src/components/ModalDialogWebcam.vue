<template>
    <b-modal
        v-bind="$attrs"
        v-on="$listeners"
        :visible="value"
        header-bg-variant="light"
        size="xl"
        centered
        :title="title"
        scrollable
        @change="e => $emit('input', e)">

        <!-- Custom Title -->
        <template #modal-title>
            <font-awesome-icon icon="camera"/>
            Webcam Upload <span v-if="camera">@ {{ cameraName }}</span>
        </template>

        <!-- Custom Footer -->
        <template #modal-footer="{ cancel, ok }">
            <b-button @click="e => { img=null; cancel() }" size="sm">Cancel</b-button>
            <b-button @click="ok" variant="primary" size="sm" :disabled="!img">
                <font-awesome-icon icon="upload"/>
                Upload Picture
            </b-button>
        </template>

        <!-- CAMERA -->
        <b-row>
            <!-- camera takes whole viewport -->
            <b-col md="8" class="border-right">
                <web-cam
                    v-show="!img"
                    ref="webcam"
                    :device-id="camId"
                    width="100%"
                    style="height: 400px"
                    :resolution="{ width: '640', height: '480'}"

                    @error="camError"
                    @cameras="cameraEnum"
                    @camera-change="cameraChange"
                />
                <!-- show image if we have one -->
                <div class="text-center">
                    <img 
                        v-if="img"
                        :src="img"
                        style="height: 400px"/>
                </div>
            </b-col>
            <!-- SNAPSHOT ONLY SHOWN IF SNAPPED -->
            <b-col md="4">
                <!-- CAMERA CONTROL -->
                <!-- camera select -->
                <b-row>
                    <b-col>
                        <b-form-group
                            label="Select Camera"
                            description="select camera to capture image for">
                            <b-form-select v-model="camera">
                                <option :value="null">-- Select Camera --</option>
                                <option v-for="(c, id) in devices"
                                    :key="c.deviceId"
                                    :value="c.deviceId">
                                    {{ c.label }}
                                </option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <!-- camera button control -->
                <b-row>
                    <b-col>
                        <div>
                            <!-- Snap! -->
                            <b-button variant="primary" v-if="!img" @click="snapPhoto">
                                <font-awesome-icon icon="camera"/>
                                SNAP!
                            </b-button>
                            <b-button variant="danger" v-else @click="clearPhoto">
                                <font-awesome-icon icon="trash-alt"/>
                                Clear
                            </b-button>
                        </div>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        
    </b-modal>
</template>

<script>
// import webcam
import { WebCam } from 'vue-web-cam'

import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
    // so we can place $attrs wherever we like
    inheritAttrs: false,

    mixins: [axiosErrorHandler],

    // list of component
    components: {
        WebCam
    },

    // props
    props: {
        prefixFilename: {
            type: String,
            default: 'photo-'
        },

        value: {
            type: [Boolean,Number,String],
            required: true
        }
    },

    // data
    data () {
        return {
            title: 'Webcam Upload', // title of dialog
            photoData: null, // will be filled when we have snapped a photo
            camId: null,
            camera: null,
            cameraName: null,
            devices: [],
            img: null
        }
    },

    // methods
    methods: {
        // generate random prefixed filename
        makeid(length) {
            var result           = this.prefixFilename || ''
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            var charactersLength = characters.length
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength))
            }
            return result
        },

        // when camera started
        camStarted () {
            this.$refs.webcam.start()
            console.log("Camera started!")
        },

        // when camera stopped
        camStopped () {
            this.$refs.webcam.stop()
            console.log("Camera stopped!")
        },

        // when camera enumeration happens
        cameraEnum (cameras) {
            this.devices = cameras
            console.log("Enumerated cameras!", cameras)
        },

        // when camera error
        camError (e) {
            console.log("Camera error", e)

            // ignore deviceId constraint error
            if (e.constraint != "deviceId")
                this.handleError(e)
        },

        // when camera changed
        cameraChange (deviceId) {
            this.camId = deviceId
            this.camera = deviceId
            console.log("Camera changed!", deviceId)
        },

        // snap photo
        snapPhoto () {
            this.img = this.$refs.webcam.capture()
        },

        // clear photo
        clearPhoto () {
            this.img = null
        }
    },

    // watchers
    watch: {
        camera: {
            immediate: true,
            handler: function (newVal) {
                this.camId = newVal
                
                console.log('camera changed -> ', newVal)

                if (newVal) {
                    this.$refs.webcam.start()
                }
            }
        },

        devices: function (newVal) {
            console.log('selecting first available camera')
            const [first,...last] = this.devices
            // select first available camera
            if (first) {
                this.camera = first.deviceId
                this.cameraName = first.label

                console.log('camera selected: ', first.label)
            }
        },

        value: {
            immediate: true,
            handler: function (newVal) {
                // we're opening?
                if (newVal) {
                    this.camera = null
                    this.img = null
                } else {
                    // we're closing. if we have a snap,
                    // upload it?
                    if (this.img) {
                        var uploadData = {
                            blob: this.img,
                            blobsize: this.img.length,
                            filesize: this.img.length,
                            type: 'image/jpeg',
                            filename : this.makeid(16) + '.jpg'
                        }
                        this.$emit('upload', uploadData)
                    }
                }
            }
        }
    }
}
</script>