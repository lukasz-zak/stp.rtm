function GraphWidget(widget, configName) {

    this.widget = widget;
    this.configName = configName

    this.dataToBind = {
        'value': '',
        'arrowClass': '',
        'percentageDiff': '',
        'oldValue': ''
    }
}

GraphWidget.prototype = new Widget();
GraphWidget.prototype.constructor = GraphWidget;

$.extend(GraphWidget.prototype, {
    /**
     * Invoked after each response from long polling server
     *
     * @param response Response from long polling server
     */
    handleResponse: function (response) {
        this.prepareData(response);
    },

    /**
     * Updates widget's state
     */
    prepareData: function (response) {

        var oldValue = this.oldValue;
        var self = this;

        /**
         * Calculating diff from last collected value
         */

        var currentValue = response.data[response.data.length - 1].y;
        if ($.isNumeric(oldValue) && $.isNumeric(response.data[response.data.length - 1].y)) {
            var diff = currentValue - oldValue;

            var percentageDiff = Math.round(Math.abs(diff) / oldValue * 100);

            this.dataToBind.percentageDiff = percentageDiff;
            this.dataToBind.oldValue = oldValue;

            if (diff > 0) {
                this.dataToBind.arrowClass = "icon-arrow-up";
            } else {
                this.dataToBind.arrowClass = "icon-arrow-down";
            }
        }

        this.dataToBind.value = currentValue;
        this.oldValue = currentValue;

        this.renderTemplate(this.dataToBind);


        /**
         * @TODO Wojtek Iskra: add dynamic adding data instead of restarting the whole chart
         */

        $('.graph', this.widget).highcharts({
            chart: {
                type: 'area'
            },
            title: {
                text: ''
            },
            xAxis: {
                title: '',
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: ''
            },
            tooltip: {
                pointFormat: 'Value of <b>{point.y}</b> noted.'
            },
            plotOptions: {
                area: {
                    pointStart: 1940,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                title: {
                    text: ''
                },
                data: response.data
            }]
        });
    }
});