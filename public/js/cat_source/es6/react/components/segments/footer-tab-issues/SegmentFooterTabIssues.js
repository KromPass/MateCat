var React = require( 'react' );
var SegmentConstants = require( '../../../constants/SegmentConstants' );
var SegmentStore = require( '../../../stores/SegmentStore' );
let SegmentFooterTabIssuesListItem = require( "./SegmentFooterTabIssuesListItem" ).default;

class SegmentFooterTabIssues extends React.Component {

    constructor( props ) {
        super( props );
        this.state = {
            categorySelected: null,
            categoriesIssue: [],
            segment: this.props.segment,
            translation: this.props.segment.translation,
            oldTranslation: this.props.segment.translation,
            isChangedTextarea: false,
            issues: []
        }
    }

    componentDidMount() {
        $( this.selectIssueCategory ).dropdown();
        $( this.selectIssueSeverity ).dropdown();

        SegmentStore.addListener( SegmentConstants.ADD_SEGMENT_VERSIONS_ISSUES, this.segmentOpened.bind( this ) );
        SegmentStore.addListener( SegmentConstants.TRANSLATION_EDITED, this.trackChanges.bind( this ) );
    }

    componentDidUpdate() {
        $( this.selectIssueSeverity ).dropdown();
        if ( this.state.categorySelected ) {
            $( this.selectIssueCategoryWrapper ).find( '.ui.dropdown' ).removeClass( 'disabled' );
        } else {
            $( this.selectIssueCategoryWrapper ).find( '.ui.dropdown' ).addClass( 'disabled' );
        }
    }

    componentWillUnmount() {
        SegmentStore.removeListener( SegmentConstants.ADD_SEGMENT_VERSIONS_ISSUES, this.segmentOpened );
        SegmentStore.removeListener( SegmentConstants.TRANSLATION_EDITED, this.trackChanges );
    }

    componentWillMount() {
        let categories = JSON.parse( config.lqa_nested_categories ).categories;
        this.setState( {
            categoriesIssue: categories
        } )
    }

    trackChanges( sid, editareaText ) {
        let text = htmlEncode( UI.prepareTextToSend( editareaText ) );
        if ( this.state.segment.sid === sid && this.state.oldTranslation !== text) {
            UI.setDisabledOfButtonApproved(this.props.sid, true);
            this.setState( {
                translation: text,
                isChangedTextarea: true
            } );
        } else {
            UI.setDisabledOfButtonApproved(this.props.sid);
            this.setState( {
                isChangedTextarea: false
            } );
        }
    }

    segmentOpened( sid, segment ) {
        let issues = [];
        segment.versions.forEach( function ( version ) {
            if ( !_.isEmpty( version.issues ) ) {
                issues = issues.concat( version.issues );
            }
        } );
        this.setState( {
            segment: segment,
            issues: issues
        } );
        let self = this;
        setTimeout(function (  ) {
            // SegmentActions.setTabIndex(self.state.segment.sid, 'issues', issues.length);
        });
    }

    allowHTML( string ) {
        return {__html: string};
    }

    sendIssue( category, severity ) {

        let data = [];
        let deferred = $.Deferred();
        let self = this,
            oldTranslation = this.state.oldTranslation;

        let issue = {
            'id_category': category.id,
            'severity': severity,
            'version': this.props.segment.version_number,
            'start_node': 0,
            'start_offset': 0,
            'send_node': 0,
            'end_offset': 0
        };


        if ( this.state.isChangedTextarea ) {
            let segment = this.props.segment;
            segment.translation = this.state.translation;
            segment.status = 'approved';
            API.SEGMENT.setTranslation( segment )
                .done( function ( response ) {
                    issue.version = response.translation.version;
                    oldTranslation = response.translation.translation;
                    deferred.resolve();
                } )
                .fail( /*self.handleFail.bind(self)*/ );
        } else {
            deferred.resolve();
        }

        data.push( issue );

        deferred.then( function () {
            SegmentActions.removeClassToSegment( self.props.sid, "modified" );
            UI.currentSegment.data( 'modified', false );
            SegmentActions.submitIssue( self.props.sid, data, [] )
                .done( response => {
                    self.setState( {
                        isChangedTextarea: false,
                        oldTranslation: oldTranslation,
                    } );
                    $( self.selectIssueSeverity ).dropdown( 'set selected', -1 );
                    UI.setDisabledOfButtonApproved(self.props.sid);
                } )
                .fail( /* self.handleFail.bind(self)*/ );
        } );

    }

    issueCategories() {
        return JSON.parse( config.lqa_nested_categories ).categories;
    }

    categoryOptionChange( e ) {
        let currentCategory = this.issueCategories().find( category => {return category.id == e.target.value} );
        this.setState( {
            categorySelected: currentCategory ? currentCategory : null
        } );
    }

    severityOptionChange( e ) {
        let selectedSeverity = e.target.value;
        if(selectedSeverity != -1){
            this.sendIssue( this.state.categorySelected, selectedSeverity )
        }
    }

    findCategory( id ) {
        return this.state.categoriesIssue.find( category => {
            return id == category.id
        } )
    }

    render() {
        let categoryOptions = [],
            categorySeverities = [],
            categoryOption,
            severityOption,
            issues = [],
            severitySelect,
            issue,
            self = this;

        this.state.categoriesIssue.forEach( function ( category, i ) {
            categoryOption = <option value={category.id} key={i} selected={self.state.categorySelected && category.id === self.state.categorySelected.id}>{category.label}</option>;
            categoryOptions.push( categoryOption );
        } );

        if ( this.state.categorySelected ) {
            this.state.categorySelected.severities.forEach( ( severity, i ) => {
                severityOption = <option value={severity.label} key={i}>{severity.label}</option>;
                categorySeverities.push( severityOption );
            } );
        }
        severitySelect =
            <select className="ui fluid dropdown" ref={( input ) => { this.selectIssueSeverity = input;}} onChange={( e ) => this.severityOptionChange( e )} disabled={!this.state.categorySelected}>
                <option value="-1">Select severity</option>
                {categorySeverities}
            </select>;

        this.state.issues.forEach( ( e, i ) => {
            issue = <SegmentFooterTabIssuesListItem key={i} issue={e} categories={this.state.categoriesIssue}/>;
            issues.push( issue );
        } );
        let containerClasses = classnames({
            "issues-container" : true,
            "add-issue-segment" : this.state.isChangedTextarea
        });
        let categoryClass = classnames({
            "field" : true,
            "select_type": _.isNull(this.state.categorySelected) || this.state.categorySelected === -1
        });
        let severityClass = classnames({
            "field" : true,
            "select_severity": !_.isNull(this.state.categorySelected) && this.state.categorySelected !== -1
        });
        return <div className={containerClasses}>
            {this.state.issues.length > 0 ? (
                <div className="title-for-issues">
                    Add issue ({this.state.issues.length})
                </div>
            ) : (
                <div className="title-for-issues">
                    Add issue
                </div>
            )}

            <div className="ui grid border-box">
                <div className="height wide column">
                    <div className="creation-issue-container ui form">
                        <div className="ui grid">
                            <div className="height wide column">
                                <div className="select-category">
                                    <div className={categoryClass}>
                                        <select className="ui fluid dropdown" ref={( input ) => { this.selectIssueCategory = input;}} onChange={( e ) => this.categoryOptionChange( e )}>
                                            <option value="-1">Select issue</option>
                                            {categoryOptions}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="height wide column">
                                <div className="select-severity">
                                    <div className={severityClass} ref={( input ) => { this.selectIssueCategoryWrapper = input;}}>
                                        {severitySelect}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="height wide column">
                    <div className="issues-list">
                        {issues}
                    </div>
                </div>
            </div>

        </div>
    }
}

export default SegmentFooterTabIssues;