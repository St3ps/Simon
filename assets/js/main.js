

var Simon = {

    sequence: [],
    copy: [],
    step: 0,
    active: false,
    mode: "normal",

    init: function() {

        var that = this;
        this.sequence = [];
        this.copy = [];
        this.step = 0;

        $('#counter').text('--');

        this.active = false;

        {
            $('#cmdStart').on('click', function () {

                if(!that.active)
                    that.start();


            })

            $('#cmdMode').on('click', function () {


                if(!that.active)
                    that.changeMode();

            })

            $('#cmdReset').on('click', function () {


                if(that.active)
                    that.reset();

            })
        }


    },

    start: function() {


        $('#cmdMode').addClass('disabled');
        $('#cmdStart').addClass('disabled');



        this.active = true;
        this.changeLog("Go!")
        this.newStep();

    },

    changeMode: function() {

        if(this.mode === "normal") {
            this.mode = "strict"
            $('#cmdMode')
                .text('Strict')
                .data("mode", "Strict");
        } else {
            this.mode = "normal";
            $('#cmdMode')
                .text('Normal')
                .data("mode", "Strict");
        }

    },


    newStep: function() {

        this.incrementStep();
        this.changeLog("Go!");


        var random = Math.floor((Math.random()*4)+1);
        this.sequence.push("circle-" + random);
        this.copy = this.sequence.slice(0);
        this.deactivateBoard();
        this.animationSequence(this.sequence);

    },

    incrementStep: function() {
        this.step++;


        if(this.step < 10 ) {

             $('#counter').text('0' + this.step);


        } else {

             $('#counter').text(this.step);


        }

    },


    activateBoard: function () {

        console.log("Board Activated");

        var that = this;

      $('.circle')

        .on('click', function(e) {

            that.registerClick(e);

        })
        .addClass('hoverable');

    },

    registerClick: function(e) {

        var desiredResponse = this.copy.shift();
        var actualResponse = $(e.target).attr('id');

        var numOfElementId = actualResponse.slice(7);
        //console.log("registerclick",numOfElementId);

        this.playSound(numOfElementId);


        this.checkClick(desiredResponse === actualResponse);



    },

    deactivateBoard: function() {

    console.log("Board Deactivated");
    var that = this;
        $('.circle')

            .off('click')
            .removeClass('hoverable');



    },

    checkClick: function(bool) {
        var that = this;
        console.log(this.copy);
        /*if all clicks have been verified correctly and the copy property's length is zero then create new step*/
        if(bool && this.copy.length === 0) {

            console.log("steps", this.step);
            if(this.step === 20) {
                this.endGame();
                this.changeLog("You made it, good job.")
            }
            else
            this.newStep();

        }

        if(!bool) {


            if(this.mode === 'normal') {
                this.changeLog("Nop. Sorry. You're in normal mode so just try again!")
                this.copy = this.sequence.slice(0);
                this.deactivateBoard();
                console.log("checkClick", this.copy);
                setTimeout(function() {

                    that.animationSequence(that.sequence);

                }, 1000)

            } else {
                this.changeLog("Afraid that wasn't quite it. Start over?")
                this.endGame();

            }

        }




    },

    playSound: function(value) {

        var audio = new Audio('../assets/sounds/simonSound' + value + '.mp3');
        audio.play();
    },

    animationSequence: function(sequence){

        this.changeLog("Making sequence...");

        var i = 0;
        var that = this;
        var interval = setInterval(function() {
            console.log("interval", sequence[i]);
            that.light(sequence[i]);

            i++;
            if (i >= sequence.length) {
                that.activateBoard();

                that.changeLog("Go!");
                clearInterval(interval);
            }
        /*I believe it's 600 because the duration of the light code block is of 300 miliseconds.
        When it finishes, you have 300ms of 'space' between them
         */
        }, 600)

    },



    light: function (tileID) {

        var tile = $('#' + tileID).addClass('lit');
        window.setTimeout(function() {
            tile.removeClass('lit');
        }, 300)

    },

    endGame: function() {


        console.log("endGame function");
        /*should be a prompt here*/

        $('#cmdMode').removeClass('disabled');
        $('#cmdStart').removeClass('disabled');


        this.active = false;
        this.init();


    },

    changeLog: function(txt) {

      $('#log').find('h2').text(txt)


    },

    reset: function() {

        this.changeLog("Alright, starting over.");
        this.endGame();

    }



};




$(document).ready(function() {


Simon.init();

});



/*
(function () {

    $('.circle').each(function (index) {

        var random = [0, 0, 0];
        random = random.map(function () {
            return (Math.floor(Math.random() * 255));
        })

        $(this).css('background-color', 'rgba(' + random[0] + ',' + random[1] + ',' + random[2] + ', 1)');

        //console.log('rgba(' + random[0] +','+ random[1] +','+ random[2] +', 1)'); //random values log

    });

}());*/
