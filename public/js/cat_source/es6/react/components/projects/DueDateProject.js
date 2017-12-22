let CSSTransitionGroup = React.addons.CSSTransitionGroup;
let GMTSelect = require('../outsource/GMTSelect').default;
/*let ManageActions = require('../../actions/ManageActions').default;*/

class DueDateProject extends React.Component {

    constructor( props ) {
        super( props );
        let date;
        this.props.project.get('due_date') ? date = new Date(this.props.project.get('due_date')*1000) : date = new Date();
        this.state = {
            date: date,
            timezone: $.cookie( "matecat_timezone")
        };
    }

    changeTimezone(value) {
        $.cookie( "matecat_timezone" , value);
        this.setState({
            timezone: value
        });
    }

    changeDueDate(){
        let date = $(this.calendar).calendar('get date');
        let time = $(this.dropdownTime).dropdown('get value');
        date.setHours(time[0]);
        // TODO : Change this line when the time change
        date.setMinutes(date.getMinutes() + (1 - parseFloat(this.state.timezone)) * 60);
        console.log(date.getTime());
        let timestamp = date.getTime()/1000;
        ManageActions.changeProjectDueDate(timestamp,this.props.project.get('id'), this.props.project.get('password'))
    }

    initDate() {
        let self = this;
        let today = new Date();
        $(this.calendar).calendar({
            type: 'date',
            minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            className: {
                calendar: 'calendar-outsource'
            }
        });
    }

    initTime() {
        let self = this;
        let time = 12;
        if (this.props.project.get('due_date')) {
            let date = APP.getGMTDate(this.props.project.get('due_date') * 1000);
            time =  date.time2.split(":")[0];
        }
        $(this.dropdownTime).dropdown({
            onChange: function(value, text, $selectedItem) {

            }
        });

        $(this.dropdownTime).dropdown('set selected', parseInt(time));
    }

    componentDidMount () {
        let self = this;
        this.initDate();
        this.initTime();
    }

    componentWillUnmount() {}

    componentDidUpdate() {
        this.initDate();
    }

    render() {
        let self = this;

        return <div className="due-date-project">
            <a href="#" className="open-due-date-box"><b>Due date project</b></a>

            <div className="select-date-box">
                {/*<a className="close shadow-1">
                    <i className="icon-cancel3 icon need-it-faster-close-icon"/>
                </a>*/}
                <div className="ui form">
                    <div className="fields">
                        <div className="field">
                            <label>Delivery Date</label>
                            <div className="ui calendar" ref={( calendar ) => this.calendar = calendar}>
                                <div className="ui input">
                                    <input type="text" placeholder="Date" defaultValue={this.state.date}/>
                                </div>
                            </div>
                        </div>
                        <div className="field input-time">
                            <label>Time</label>
                            <select className="ui fluid search dropdown"
                                    ref={( dropdown ) => this.dropdownTime = dropdown}>
                                <option value="7">7:00 AM</option>
                                <option value="8">8:00 AM</option>
                                <option value="9">9:00 AM</option>
                                <option value="10">10:00 AM</option>
                                <option value="11">11:00 AM</option>
                                <option value="12">12:00 AM</option>
                                <option value="13">1:00 PM</option>
                                <option value="14">2:00 PM</option>
                                <option value="15">3:00 PM</option>
                                <option value="16">4:00 PM</option>
                                <option value="17">5:00 PM</option>
                                <option value="18">6:00 PM</option>
                                <option value="19">7:00 PM</option>
                                <option value="20">8:00 PM</option>
                                <option value="21">9:00 PM</option>
                            </select>
                        </div>
                        <div className="field gmt">
                            <GMTSelect changeValue={this.changeTimezone.bind( this )}/>
                        </div>
                        <div className="field">
                            <button className="set-date ui blue basic button"
                                onClick={this.changeDueDate.bind(this)}
                            >
                                Set date
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>;


    }
}


export default DueDateProject;
