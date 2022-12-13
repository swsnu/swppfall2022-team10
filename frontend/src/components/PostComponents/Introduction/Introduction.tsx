import Layout from '../../Layout/Layout'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import './Introduction.scss'


const Introduction = () => {
    const navigate = useNavigate()

    return (
        <Layout>
            <div className='ListContainer'>
                <div className='InfoContainer'>
                    <div className='title'>Welcome to Be A Family</div>
                    <br />
                    <div className='Infos'>
                        <Accordion>
                            <Accordion.Item eventKey='0'>
                                <Accordion.Header>
                                    About Be A Family
                                </Accordion.Header>
                                <Accordion.Body>
                                    {`Why Stray Animals? Whilst the number of household pets continue to grow, more and more animals are abandoned behind the door. Thankfully, the call  “Don’t buy, Adopt” is gaining more attention – but where do we go when we finally decide to add a family member to our lives?
                                    Be A Family wishes to provide a safe, fast bridge between stray animals and people. Here, users actively share posts of stray animals, apply for adoptions and share their experiences. Together we plan a better future, where animals find loving homes.`}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey='1'>
                                <Accordion.Header>
                                    {`Don't buy. Please Adopt.`}
                                </Accordion.Header>
                                <Accordion.Body>
                                    {`Why Stray Animals? Whilst the number of household pets continue to grow, more and more animals are abandoned behind the door. Thankfully, the call  “Don’t buy, Adopt” is gaining more attention – but where do we go when we finally decide to add a family member to our lives?
                                    Be A Family wishes to provide a safe, fast bridge between stray animals and people. Here, users actively share posts of stray animals, apply for adoptions and share their experiences. Together we plan a better future, where animals find loving homes.`}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey='2'>
                                <Accordion.Header>
                                    Who we are
                                </Accordion.Header>
                                <Accordion.Body>
                                    {`We are Seorin Choi, Suebin Kim, Jinhee Pyun, Junyoung Yeom`}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey='3'>
                                <Accordion.Header>
                                    Be A Family 이용 약관
                                </Accordion.Header>
                                <Accordion.Body>
                                    이용 약관을 읽지 않아 발생하는 모든 일의 책임은 본인에게 있습니다
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                    <br />
                    <div className='title'>User Guide</div>
                    <Card className="text-center">
                        <Card.Header>For Foster Carers</Card.Header>
                        <Card.Body>
                            <Card.Title>유기 동물을 보호 중이세요?</Card.Title>
                            <Card.Text>
                                길에서 찾은 유기 동물을 보호 중이세요?
                                유기 동물 보호 센터의 동물들을 등록하고 싶으신가요?
                            </Card.Text>
                            <Button variant="outline-primary"
                                onClick={() =>
                                    navigate(`/post/create`)
                                }>입양 포스트 작성하러 가기</Button>
                        </Card.Body>
                        <Card.Footer className="text-muted">Updated 2 days ago</Card.Footer>
                    </Card>
                    <br />
                    <Card className="text-center">
                        <Card.Header>For First-time Carers</Card.Header>
                        <Card.Body>
                            <Card.Title>유기 동물 입양 신청서</Card.Title>
                            <Card.Text>
                                {`Be A Family는 유기 동물 입양을 위한 기본 입양 신청서 양식을 제공해 드립니다. 사용자 여러분은 신청서 양식을 자유롭게 편집할 수 있습니다.`}
                            </Card.Text>
                            <Button variant="outline-info"
                                onClick={() =>
                                    window.open('https://drive.google.com/drive/folders/1yar7YQBlIHAgWZHgjYPZukUtc-G60JMk?usp=sharing')
                                }>입양 신청서 다운 받으러 가기</Button>
                        </Card.Body>
                        <Card.Footer className="text-muted">Updated 2 days ago</Card.Footer>
                    </Card>
                    <br />
                    <Card className="text-center">
                        <Card.Header>For First-time Users</Card.Header>
                        <Card.Body>
                            <Card.Title>처음 방문하셨나요?</Card.Title>
                            <Card.Text>
                                Be A Family에 오신 것을 환영합니다!
                            </Card.Text>
                            <div className='buttons'>
                                <Button variant="outline-primary"
                                    onClick={() =>
                                        navigate(`/`)
                                    }>입양 포스트 보러 가기</Button>
                                <Button variant="outline-primary"
                                    onClick={() =>
                                        navigate(`/review`)
                                    }>입양 리뷰 보러 가기</Button>
                                <Button variant="outline-primary"
                                    onClick={() =>
                                        navigate(`/qna`)
                                    }>입양 관련 질문 하러가기</Button>
                            </div>
                        </Card.Body>
                        <Card.Footer className="text-muted">Updated 2 days ago</Card.Footer>
                    </Card>
                    <br />
                    <Card className="text-center">
                        <Card.Header>For Adopters</Card.Header>
                        <Card.Body>
                            <Card.Title>이미 Be A Family에서 입양을 진행하셨나요?</Card.Title>
                            <Card.Text>
                                {`입양한 동물에 대한 Review를 작성해 보세요! 
                                자세한 리뷰는 또 다른 입양에 도움이 됩니다 :)`}
                            </Card.Text>
                            <Button variant="outline-success"
                                onClick={() =>
                                    navigate(`/reviews/create`)
                                }>입양 리뷰 작성하러 가기</Button>
                        </Card.Body>
                        <Card.Footer className="text-muted">Updated 2 days ago</Card.Footer>
                    </Card>
                    <br />
                </div>
            </div>
        </Layout>
    )
}

export default Introduction
