import React, { Component } from 'react'
import {
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Col
} from "reactstrap";
import { Alert } from 'react-bootstrap'
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
        this.state = { keyword: "", results : [], error: "", isLoading: false, showAlert: false};
    
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
                    <h4 style={{textAlign:"justify", padding:"10px 30px"}}>Results for {keyword}...</h4>
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
                                <React.Fragment key={movie.imdbID}>
                                    <Nominations movie={movie}/>
                                </React.Fragment>
                            )
                        })}
                    </ul>
                </div>
            )
        }
    }

    


    render() {
        const {error, isLoading } = this.state;
        return (
            <div>
                <br/><br/>
                {/*Show banner if number of nominations equals 5*/}
                {
                    this.props.mainPageState.nominations.length >= 5 &&
                    <Alert variant="success">
                        <Alert.Heading>5 Nominations Banner</Alert.Heading>
                        <p>You have nominated atleast 5 movies! Enjoy!</p>
                    </Alert>
                }


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
                    <h4 style={{textAlign:"justify", padding:"10px 30px"}}>Nominations</h4>
                        {!(this.props.mainPageState.nominations.length) ? (
                            <p>No nominations added. Please search for a movie and add them.</p>
                        ):(
                            this.renderNominations()
                        )
                           }
                    </div>
               </div>
                
            
                
                {/*Too many results or movie not found*/}
               { error && <h3 className="errorMessage">{error}</h3> }
                
               <img  src={Loader} className={`search-loading ${isLoading ? 'show' : 'hide' }`}  alt="loader"/>

               
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    mainPageState: state.mainPageState
});

export default connect(mapStateToProps)(SearchBar)

