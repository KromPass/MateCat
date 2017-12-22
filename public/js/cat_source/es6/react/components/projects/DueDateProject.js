let CSSTransitionGroup = React.addons.CSSTransitionGroup;

class DueDateProject extends React.Component {

    constructor( props ) {
        super( props );
        let date;
        this.props.project.get('due_date') ? date = moment(this.props.project.get('due_date')*1000) : date = moment();
        this.state = {
            date: date
        };
    }

    changeDueDate(){
        let date = $(this.calendar).calendar('get date');
        let time = $(this.dropdownTime).dropdown('get value');
        date.setHours(time[0]);
        // TODO : Change this line when the time change
        date.setMinutes(date.getMinutes());

        let timestamp = moment.utc(date).unix();
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
            time = moment(this.props.project.get('due_date') * 1000).format('HH:mm');
            time =  time.split(":")[0];
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
        let screenDate;
        this.props.project.get('due_date') ? screenDate = this.state.date.format('llll') : screenDate = "Due date project";
        return <div className="due-date-project">
            <a href="#" className="open-due-date-box"><b>{screenDate}</b></a>

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
                                    <input type="text" placeholder="Date" defaultValue={this.state.date.format()}/>
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
