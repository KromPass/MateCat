import LanguageSelectorList from "./LanguageSelectorList";
import LanguageSelectorSearch from "./LanguageSelectorSearch";

class LanguageSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedLanguages: null,
			initialLanguages: null,
			querySearch: ''
		};
	}

	componentDidMount() {
		const {selectedLanguagesFromDropdown, languagesList} = this.props;
		this.setState({
			selectedLanguages: selectedLanguagesFromDropdown.map(e => languagesList.filter(i => i.code === e)[0]),
			initialLanguages: selectedLanguagesFromDropdown.map(e => languagesList.filter(i => i.code === e)[0])
		})

	}

	componentWillUnmount() {
	}

	componentDidUpdate() {

	}

	render() {
		const {onQueryChange, onToggleLanguage, onConfirm, preventDismiss, onRestore} = this;
		const {languagesList, onClose} = this.props;
		const {selectedLanguages, querySearch} = this.state;
		return <div id="matecat-modal-languages" className="matecat-modal" onClick={onClose}>
			<div className="matecat-modal-content" onClick={preventDismiss}>

				<div className="matecat-modal-header">
					<span className={"modal-title"}>Multiple Languages</span>
					<span className="close-matecat-modal x-popup" onClick={onClose}/>
				</div>

				<div className="matecat-modal-body">

					<div className="matecat-modal-subheader">
						<div className={"language-from"}>

							<div className={"first-column"}>
								<span className={"label"}>From:</span>
							</div>
							<div>
								<span>Italian</span>
							</div>
						</div>
						<div className={"language-to"}>
							<div className={"first-column"}>
								<span className={"label"}>To:</span>
							</div>
							<div className={"language-search"}>
								<LanguageSelectorSearch languagesList={languagesList}
														selectedLanguages={selectedLanguages}
														querySearch={querySearch}
														onDeleteLanguage={onToggleLanguage}
														onQueryChange={onQueryChange}/>
							</div>
						</div>
					</div>

					<LanguageSelectorList languagesList={languagesList} selectedLanguages={selectedLanguages}
										  querySearch={querySearch}
										  changeQuerySearch={onQueryChange}
										  onToggleLanguage={onToggleLanguage}/>

				</div>

				<div className="matecat-modal-footer">
					<div className="selected-counter">
						<span className={"uncheck-all"} onClick={() => {
							this.setState({selectedLanguages: []})
						}}>&times;</span>
						<span className={"badge"}>{selectedLanguages && selectedLanguages.length}</span>
						<span className={"label"}>language selected</span>
					</div>
					<div className="">
						<button className={"modal-btn secondary gray"} onClick={onRestore}>Restore all</button>
						<button className={"modal-btn primary blue"} onClick={onConfirm}>Confirm</button>
					</div>
				</div>

			</div>
		</div>
	}

	preventDismiss = (event) => {
		event.stopPropagation();
	}
	onConfirm = () => {
		//confirm must have 1 language selected
		const {selectedLanguages} = this.state;
		this.props.onConfirm(selectedLanguages);
	};

	onQueryChange = (querySearch) => {
		this.setState({querySearch})
	};

	onToggleLanguage = (language) => {
		const {selectedLanguages} = this.state;
		let newSelectedLanguages = [...selectedLanguages];
		const indexSearch = selectedLanguages.map(e => e.code).indexOf(language.code);
		if (indexSearch > -1) {
			newSelectedLanguages.splice(indexSearch, 1)
		} else {
			newSelectedLanguages.push(language);
		}
		this.setState({
			selectedLanguages: newSelectedLanguages
		})
		//when add a language, restore query search.
	};

	onRestore = () => {
		const {initialLanguages} = this.state;
		this.setState({
			selectedLanguages: initialLanguages,
			querySearch: ''
		})
	};


}

Header.defaultProps = {
	selectedLanguagesFromDropdown: false,
	languagesList: true,
	onClose: true,
	onConfirm: true
};

export default LanguageSelector;