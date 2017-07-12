let OutsourceConstants = require('../../constants/OutsourceConstants');
let GMTSelect = require('./GMTSelect').default;
class AssignToTranslator extends React.Component {


    constructor(props) {
        super(props);
        this.timezone = APP.getDefaultTimeZone();
    }

    shareJob() {
        //Check email and validations errors
        let date = $(this.date).data('timestamp');
        let email = this.email.value;

        OutsourceActions.sendJobToTranslator(email, date, this.timezone, this.props.job.toJS(), this.props.project.toJS());
    }

    GmtSelectChanged(value) {
        this.timezone = value;
        console.log("GMT Changed : ", value);
    }

    allowHTML(string) {
        return { __html: string };
    }

    componentDidMount () {
        $(this.dateInput).datetimepicker({
            step:30,
            validateOnBlur: false,
            defaultTime: '09:00',
            minDate:0,
            onChangeDateTime: function (newDateTime, $input) {
                let date = APP.fromDateToString(newDateTime);
                let dateString = date.day + ' ' + date.month + ' ' + date.year + ' at ' + date.time ;
                $input.val(dateString);
                $input.data('timestamp', new Date(newDateTime).getTime());
            }
        });

        $('.ui.dropdown')
            .dropdown()
        ;
    }

    componentWillUnmount() {
        $(this.dateInput).datetimepicker('destroy');
    }

    componentDidUpdate() {}

    render() {
        let date = '';
        let translatorEmail = '';
        let delivery = '';
        if (this.props.job.get('translator')) {
            let delivery =  APP.fromDateToString(this.props.job.get('translator').get('delivery_timestamp') * 1000);
            date =  delivery.day + ' ' + delivery.month + ' ' + delivery.year + ' at ' + delivery.time;
            translatorEmail = this.props.job.get('translator').get('email');
        }
        return <div className="assign-job-translator">
            <div className="title">
                Assign Job to translator
            </div>
            <div className="title-url ui grid">
                <div className="job-url">
                    <a href={window.location.protocol + '//' + window.location.host + this.props.url} target="_blank">
                        {window.location.protocol + '//' + window.location.host + this.props.url}</a>
                </div>
                <div className="translator-assignee">
                    <div className="ui form">
                        <div className="fields">
                            <div className="field">
                                <label>Translator email</label>
                                <input type="email" placeholder="translator@email.com" defaultValue={translatorEmail}
                                       ref={(email) => this.email = email}/>
                            </div>
                            <div className="field">
                                <label>Delivery date</label>
                                <input id="date-picker-translator" type="text" placeholder="Date" defaultValue={date}
                                       ref={(date) => this.dateInput = date}/>
                            </div>
                            <div className="field gmt">
                                <GMTSelect changeValue={this.GmtSelectChanged.bind(this)}/>
                            </div>
                            <div className="field send-job-box">
                                <button className="send-job ui primary button"
                                onClick={this.shareJob.bind(this)}>Send Job to Translator</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>;
    }
}

export default AssignToTranslator ;