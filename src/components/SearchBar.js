import React, { Component } from 'react'
import {
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Col
} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Results from './Results'
import { connect } from 'react-redux';
import Axios from 'axios'
import Loader from '../loader.gif'
import '../Search.css'
import Nominations from './Nominations'

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = { keyword: "", results : [], error: "", isLoading: false};
    
        this.cancel = ''
    }

    fetchResults = (search) =>{
        const url = `http://www.omdbapi.com/?apikey=9c54a82a&s=${search}`

        if (this.cancel) {
            // Cancel the previous request before making a new request
            this.cancel.cancel();
        }
        // Create a new CancelToken
        this.cancel = Axios.CancelToken.source();
        Axios.get(url, {
            cancelToken: this.cancel.token
        })
        .then(res=>{
            this.setState({
				results: res.data.Search,
				error: res.data.Error,
				isLoading: false,
			});
        })
        .catch((error) => {
			if (Axios.isCancel(error) || error) {
				this.setState({
					isLoading: false,
					error: 'Failed to fetch results.Please check network',
				});
			}
		});
    }
    
    handleOnChange = (e) =>{
        const keyword = e.target.value;
        if ( keyword === "" ) {
            this.setState({ keyword, results: [], error: '' } );
        } else {
            this.setState({ keyword, isLoading: true, error: '' }, () => {
                this.fetchResults(keyword);
            });
        }
    }

    handleSubmit = (e) =>{
        e.preventDefault();
    }

    renderResults = () =>{
        //Create Movies Result List
        const { results, keyword } = this.state;
        if(results !== undefined){
            return(
                <div className="results-container">
                    <h4 style={{textAlign:"justify"}}>Results for {keyword}...</h4>
                    <ul>
                        {results.map( movie =>{
                            return(
                                <Results movie={movie}/>
                            )
                        })}
                    </ul>
                </div>
            )
        }
        
    }

    
    renderNominations = () =>{
        //Create Nominations List
        const { nominations } = this.props.mainPageState
        if(nominations !== undefined){
            return(
                <div>
                    <ul>
                        {nominations.map( movie =>{
                            return(
                                <Nominations movie={movie}/>
                            )
                        })}
                    </ul>
                </div>
            )
        }
    }

    render() {
        console.log(this.props);
        const {error, isLoading } = this.state;
        return (
            <div>
                <br/><br/>
                {/*Form for Movie Search*/}
                <div style={{padding:"0 20%", margin: "0", width:"auto"}}> 
                        <Col>
                        <Form onSubmit={this.handleSubmit}>
                            <InputGroup className="mb-4">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <FontAwesomeIcon icon={faSearch} />
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Search for a movie" type="text" onChange={this.handleOnChange}/>
                            </InputGroup>
                        </Form>
                        </Col>                  
                </div>
               
               <div style={{display:"flex"}}>
                    
                    {/*Movies Search Result*/}
                    {this.state.keyword !== "" && this.renderResults()}
                    
                    {/*Nominations Result*/}
                    <div className="nominations-container">
                        <h3>Nominations</h3>
                        {!(this.props.mainPageState.nominations.length) ? (
                            <p>No nominations added. Please search for a movie and add them.</p>
                        ):(
                            this.renderNominations()
                        )
                           }
                    </div>
               </div>
                
            
                
                {/*Too many results or movie not found*/}
               { error && <h4>{error}</h4> }
                
               <img  src={Loader} className={`search-loading ${isLoading ? 'show' : 'hide' }`}  alt="loader"/>

               {/*Show banner if number of nominations equals 5*/}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    mainPageState: state.mainPageState
});

export default connect(mapStateToProps)(SearchBar)

