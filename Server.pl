% =============================================================
%  Urban Business Expert System — SWI-Prolog HTTP Server
%  Run with:  swipl server.pl
%  Then open: http://localhost:8080  (or just open urban-business-expert-system.html)
% =============================================================

:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_cors)).

% ---------- Routes ----------
:- http_handler(root(analyze), handle_analyze, [method(post)]).
:- http_handler(root(.),        handle_index,   []).

% ---------- Start server ----------
:- initialization(start_server, main).

start_server :-
    Port = 8080,
    format("Server running at http://localhost:~w~n", [Port]),
    http_server(http_dispatch, [port(Port)]).

% ---------- Serve index.html ----------
handle_index(_Request) :-
    http_reply_file('urban-business-expert-system.html', [], _Request).

% ---------- Main analysis endpoint ----------
handle_analyze(Request) :-
    cors_enable(Request, [methods([post])]),
    http_read_json_dict(Request, Data),

    % Extract inputs from JSON
    UnemploymentRate    = Data.unemployment_rate,
    BusinessType        = Data.business_type,
    ExpectedIncome      = Data.expected_income,
    BreakEvenPoint      = Data.break_even_point,
    RentCostPct         = Data.rent_cost_pct,
    CompetitorsCount    = Data.competitors_count,
    SameType            = Data.same_type,
    OnlineReviews       = Data.online_reviews_competitors,
    SeasonalBusiness    = Data.seasonal_business,
    BackupStrategy      = Data.backup_strategy,
    NearUniversity      = Data.near_university,
    TourismArea         = Data.tourism_area,
    PopDensity          = Data.pop_density,
    YouthRatio          = Data.youth_ratio,
    AreaDevelopment     = Data.area_development,
    NearTransport       = Data.proximity_to_transport,
    SecurityLevel       = Data.security_level,
    CapitalBuffer       = Data.capital_buffer,
    UVP                 = Data.unique_value_proposition,
    LocalTrend          = Data.local_trend,

    % Run inference engine
    run_inference(
        UnemploymentRate, BusinessType, ExpectedIncome, BreakEvenPoint,
        RentCostPct, CompetitorsCount, SameType, OnlineReviews,
        SeasonalBusiness, BackupStrategy, NearUniversity, TourismArea,
        PopDensity, YouthRatio, AreaDevelopment, NearTransport,
        SecurityLevel, CapitalBuffer, UVP, LocalTrend,
        Results
    ),

    reply_json_dict(Results).

% =============================================================
%  KNOWLEDGE BASE — Pure Prolog rules
% =============================================================

% --- Demand Risk ---
% IF unemployment_rate = high AND business_type = luxury THEN demand_risk = high
demand_risk(high, high, luxury) :- !.
demand_risk(low,  low,  _)      :- !.
demand_risk(medium, _, _).

% --- Financial Risk ---
% IF rent_cost > 40% THEN financial_risk = high
financial_risk(high, RentPct) :- RentPct > 40, !.
financial_risk(low,  _).

% --- Below Break-Even ---
% IF expected_income < break_even THEN below_bep = yes
below_bep(yes, Inc, Bep) :- Inc < Bep, !.
below_bep(no,  _,   _).

% --- Market Saturation ---
% IF competitors > 8 AND same type THEN saturation = severe
saturation(severe,      N, yes) :- N > 8, !.
saturation(acceptable,  _, _).

% --- Opportunity ---
% IF competitors = 0 AND demand = high THEN opportunity = strong
% IF reviews = poor THEN opportunity = moderate
opportunity(strong,   0, yes, _)    :- !.
opportunity(moderate, _, _,   poor) :- !.
opportunity(low,      _, _,   _).

% --- Seasonal Risk ---
% IF seasonal = yes AND no backup THEN seasonal_risk = high
seasonal_risk(high, yes, no)  :- !.
seasonal_risk(low,  _,   _).

% --- University Boost ---
% IF near_university = yes AND student-oriented type THEN boost = yes
student_oriented(cafe).
student_oriented(gaming_cafe).
student_oriented(stationery).
student_oriented(tutoring).
student_oriented(fast_food).

university_boost(yes, yes, BT) :- student_oriented(BT), !.
university_boost(no,  _,   _).

% --- Future Growth ---
% IF area_development = yes THEN future_growth = high
future_growth(high,     yes) :- !.
future_growth(moderate, _).

% --- Demand Level ---
% IF youth_ratio > 50 AND gaming_cafe THEN very_high
demand_level(very_high, _, gaming_cafe, Youth, _) :- Youth > 50, !.
% IF tourism_area = yes AND handicraft THEN very_high
demand_level(very_high, yes, handicraft, _, _)    :- !.
% From population density
demand_level(high,   _, _, _, high)   :- !.
demand_level(medium, _, _, _, medium) :- !.
demand_level(low,    _, _, _, _).

% --- Demand Potential ---
demand_potential(low,    low)    :- !.
demand_potential(medium, medium) :- !.
demand_potential(high,   _).

% --- Stability ---
% IF capital_buffer < 3 THEN weak
stability(weak,   B) :- B < 3,  !.
stability(strong, B) :- B >= 6, !.
stability(stable, _).

% --- Investment Risk ---
% IF security_level = low THEN investment_risk = high
investment_risk(high,   low)    :- !.
investment_risk(medium, medium) :- !.
investment_risk(low,    _).

% --- Accessibility ---
% IF near_transport = yes THEN accessibility = good
accessibility(good, yes) :- !.
accessibility(poor, _).

% --- Competitive Advantage ---
% IF uvp = yes THEN strong
competitive_advantage(strong, yes) :- !.
competitive_advantage(weak,   _).

% --- Customer Interest ---
% IF local_trend = declining THEN customer_interest = low
customer_interest(low,     declining) :- !.
customer_interest(stable,  growing)   :- !.
customer_interest(neutral, _).

% --- Compound Failure Risk ---
failure_risk(high, _,        _,       yes, _, _, _, _, _) :- !.  % below bep
failure_risk(high, severe,   _,       _,   low, _, _, _, _) :- !. % saturation+low density
failure_risk(high, _,        _,       _,   _, weak,  high, _, _) :- !. % weak+high risk
failure_risk(high, severe,   _,       _,   _, _,     _,    high, _) :- !. % saturation+fin
failure_risk(high, _,        high,    _,   _, weak,  _,    _,   _) :- !. % seasonal+weak
failure_risk(medium, _,      _,       _,   _, _,     _,    high, _) :- !.
failure_risk(medium, severe, _,       _,   _, _,     _,    _,   _) :- !.
failure_risk(medium, _,      _,       _,   _, weak,  _,    _,   _) :- !.
failure_risk(low,    _,      _,       _,   _, _,     _,    _,   _).

% --- Success Probability ---
success_probability(high, yes,  DL,  _,    _,    _,    _, _) :- member(DL,[high,very_high]), !.
success_probability(high, _,    DL,  good, _,    strong,_,_) :- member(DL,[high,very_high]), !.
success_probability(high, _,    _,   _,    strong,_,   stable,_) :- !.
success_probability(high, _,    _,   _,    strong,_,   strong,_) :- !.
success_probability(moderate, _,_,   _,    _,    _,    _,  high) :- !.
success_probability(moderate, _,_,   _,    _,    _,    _,  _).



% =============================================================
%  INFERENCE ENGINE — Calls all rules, builds result dict
% =============================================================

run_inference(
    UnemploymentRate, BusinessType, ExpectedIncome, BreakEvenPoint,
    RentCostPct, CompetitorsCount, SameType, OnlineReviews,
    SeasonalBusiness, BackupStrategy, NearUniversity, TourismArea,
    PopDensity, YouthRatio, AreaDevelopment, NearTransport,
    SecurityLevel, CapitalBuffer, UVP, LocalTrend,
    Results
) :-
    % Evaluate each rule
    demand_risk(DemandRisk,         UnemploymentRate, BusinessType),
    financial_risk(FinRisk,         RentCostPct),
    below_bep(BelowBep,             ExpectedIncome, BreakEvenPoint),
    saturation(Saturation,          CompetitorsCount, SameType),
    opportunity(Opportunity,        CompetitorsCount, SameType, OnlineReviews),
    seasonal_risk(SeasonalRisk,     SeasonalBusiness, BackupStrategy),
    university_boost(UniBoost,      NearUniversity, BusinessType),
    future_growth(FutureGrowth,     AreaDevelopment),
    demand_level(DemandLevel,       TourismArea, BusinessType, YouthRatio, PopDensity),
    demand_potential(DemandPot,     PopDensity),
    stability(Stability,            CapitalBuffer),
    investment_risk(InvRisk,        SecurityLevel),
    accessibility(Access,           NearTransport),
    competitive_advantage(CompAdv,  UVP),
    customer_interest(CustInterest, LocalTrend),

    % Compound rules
    failure_risk(FailureRisk,
        Saturation, SeasonalRisk, BelowBep, DemandPot,
        Stability, InvRisk, FinRisk, Opportunity),

    success_probability(SuccessProb,
        UnivBoost, FutureGrowth, Access, Opportunity, 
        CompAdv, DemandPot, CustomerInterest),

    % Compute score (0–100)
    compute_score_args(
        BelowBep, Saturation, DemandPot, CustInterest, Stability,
        InvRisk, FinRisk, SeasonalRisk, DemandRisk,
        Access, CompAdv, Opportunity, DemandLevel,
        CapitalBuffer, ExpectedIncome, BreakEvenPoint,
        UniBoost, FutureGrowth, SuccessProb,
        Score),

    classify_risk(FailureRisk, SuccessProb, Score, RiskLevel),

    % Recommendations
    gather_recommendations_args(
        BelowBep, FinRisk, Saturation, Stability, InvRisk,
        CustInterest, CompAdv, SeasonalRisk, DemandRisk,
        DemandPot, Access, Opportunity, UniBoost, FutureGrowth,
        SuccessProb, FailureRisk, RiskLevel,
        Recs),

    % Build response dict
    Results = _{
        demand_risk:          DemandRisk,
        financial_risk:       FinRisk,
        below_bep:            BelowBep,
        saturation:           Saturation,
        opportunity:          Opportunity,
        seasonal_risk:        SeasonalRisk,
        university_boost:     UniBoost,
        future_growth:        FutureGrowth,
        demand_level:         DemandLevel,
        demand_potential:     DemandPot,
        stability:            Stability,
        investment_risk:      InvRisk,
        accessibility:        Access,
        competitive_advantage: CompAdv,
        customer_interest:    CustInterest,
        failure_risk:         FailureRisk,
        success_probability:  SuccessProb,
        risk_level:           RiskLevel,
        score:                Score,
        recommendations:      Recs
    }.

% =============================================================
%  SCORING — weighted contribution of each factor
% =============================================================

compute_score_args(
    BelowBep, Saturation, DemandPot, CustInterest, Stability,
    InvRisk, FinRisk, SeasonalRisk, DemandRisk,
    Access, CompAdv, Opportunity, DemandLevel,
    CapitalBuffer, Income, Bep,
    UniBoost, FutureGrowth, SuccessProb,
    Score
) :-
    S0 = 50,
    ( BelowBep    == yes     -> P1 is 25 ; P1 is 0 ),
    ( Saturation  == severe  -> P2 is 10 ; P2 is 0 ),
    ( DemandPot   == low     -> P3 is 10 ; P3 is 0 ),
    ( CustInterest== low     -> P4 is  8 ; P4 is 0 ),
    ( Stability   == weak    -> P5 is  5 ; P5 is 0 ),
    ( InvRisk     == high    -> P6 is  7 ; P6 is 0 ),
    ( FinRisk     == high    -> P7 is  8 ; P7 is 0 ),
    ( SeasonalRisk== high    -> P8 is  6 ; P8 is 0 ),
    ( DemandRisk  == high    -> P9 is  6 ; P9 is 0 ),

    ( Access   == good             -> B1 is  8 ; B1 is 0 ),
    ( CompAdv  == strong           -> B2 is 10 ; B2 is 0 ),
    ( Opportunity == strong        -> B3 is 20 ; B3 is 0 ),
    ( member(DemandLevel,[high,very_high]) -> B4 is 8 ; B4 is 0 ),
    ( member(Stability,[stable,strong])   -> B5 is 5 ; B5 is 0 ),
    ( CapitalBuffer >= 6           -> B6 is  5 ; B6 is 0 ),
    ( Bep > 0, Income > Bep * 1.3 -> B7 is 10 ; B7 is 0 ),
    ( UniBoost == yes              -> B8 is  7 ; B8 is 0 ),
    ( FutureGrowth == high         -> B9 is  5 ; B9 is 0 ),
    ( SuccessProb  == high         -> B10 is 5 ; B10 is 0 ),

    TotalP is P1+P2+P3+P4+P5+P6+P7+P8+P9,
    TotalB is B1+B2+B3+B4+B5+B6+B7+B8+B9+B10,
    Raw is S0 - TotalP + TotalB,
    Score is max(5, min(95, Raw)).

classify_risk(high,   _,        _,     high_failure_risk) :- !.
classify_risk(medium, high,     Score, low_risk)    :- Score >= 55, !.
classify_risk(medium, _,        _,     medium_risk) :- !.
classify_risk(low,    high,     Score, low_risk)    :- Score >= 55, !.
classify_risk(low,    _,        _,     medium_risk).

% =============================================================
%  RECOMMENDATIONS — natural language advice
% =============================================================

gather_recommendations_args(
    BelowBep, FinRisk, Saturation, Stability, InvRisk,
    CustInterest, CompAdv, SeasonalRisk, DemandRisk,
    DemandPot, Access, Opportunity, UniBoost, FutureGrowth,
    SuccessProb, FailureRisk, RiskLevel,
    Recs
) :-
    findall(R, rec(
        R, BelowBep, FinRisk, Saturation, Stability, InvRisk,
        CustInterest, CompAdv, SeasonalRisk, DemandRisk,
        DemandPot, Access, Opportunity, UniBoost, FutureGrowth,
        SuccessProb, FailureRisk, RiskLevel
    ), Recs).

rec("CRITICAL: Income is below break-even — revisit pricing or cut costs before launching.",
    yes,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_).
rec("Rent exceeds 40% of income — renegotiate lease or find a cheaper location.",
    _,high,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_).
rec("Market is severely saturated — differentiate strongly or target an underserved sub-segment.",
    _,_,severe,_,_,_,_,_,_,_,_,_,_,_,_,_,_).
rec("Capital buffer under 3 months — secure more reserve before starting.",
    _,_,_,weak,_,_,_,_,_,_,_,_,_,_,_,_,_).
rec("Low security raises investment risk — factor this into contingency planning.",
    _,_,_,_,high,_,_,_,_,_,_,_,_,_,_,_,_).
rec("Declining local trend — validate whether temporary or structural before investing.",
    _,_,_,_,_,low,_,_,_,_,_,_,_,_,_,_,_).
rec("No unique value proposition — identify clearly what makes this business different.",
    _,_,_,_,_,_,weak,_,_,_,_,_,_,_,_,_,_).
rec("Seasonal business with no backup strategy — plan an off-season revenue stream.",
    _,_,_,_,_,_,_,high,_,_,_,_,_,_,_,_,_).
rec("High unemployment + luxury positioning — consider a more accessible price point.",
    _,_,_,_,_,_,_,_,high,_,_,_,_,_,_,_,_).
rec("Low population density limits customer base — consider delivery or online sales.",
    _,_,_,_,_,_,_,_,_,low,_,_,_,_,_,_,_).
rec("Good transport access is an asset — highlight it in your marketing.",
    _,_,_,_,_,_,_,_,_,_,good,_,_,_,_,_,_).
rec("Zero competition + high demand is a rare opportunity — move quickly.",
    _,_,_,_,_,_,_,_,_,_,_,strong,_,_,_,_,_).
rec("Near university with student-friendly business — leverage campus marketing.",
    _,_,_,_,_,_,_,_,_,_,_,_,yes,_,_,_,_).
rec("Area development signals future growth — consider a medium-term lease.",
    _,_,_,_,_,_,_,_,_,_,_,_,_,high,_,_,_).
rec("Overall conditions are favorable — focus on execution and customer experience.",
    _,_,_,_,_,_,_,_,_,_,_,_,_,_,high,low,low_risk).

% ---------- Interactive Terminal CLI ----------

run_cli :-
    writeln('--- Urban Business Expert System (Terminal Mode) ---'),
    ask_question('Unemployment Rate (high/low)', UnemploymentRate),
    ask_question('Business Type (cafe/luxury/gaming_cafe/etc)', BusinessType),
    ask_question('Expected Income (number)', IncomeStr), atom_number(IncomeStr, ExpectedIncome),
    ask_question('Break Even Point (number)', BepStr), atom_number(BepStr, BreakEvenPoint),
    ask_question('Rent Cost % (0-100)', RentStr), atom_number(RentStr, RentCostPct),
    ask_question('Competitors Count (number)', CompStr), atom_number(CompStr, CompetitorsCount),
    ask_question('Are competitors the same type? (yes/no)', SameType),
    ask_question('Competitor reviews? (poor/good)', OnlineReviews),
    ask_question('Is it a seasonal business? (yes/no)', Seasonal),
    ask_question('Do you have a backup strategy? (yes/no)', Backup),
    ask_question('Near a university? (yes/no)', NearUni),
    ask_question('In a tourism area? (yes/no)', Tourism),
    ask_question('Population Density (high/medium/low)', PopDensity),
    ask_question('Youth Ratio % (0-100)', YouthStr), atom_number(YouthStr, YouthRatio),
    ask_question('Is the area developing? (yes/no)', AreaDev),
    ask_question('Near public transport? (yes/no)', NearTrans),
    ask_question('Security Level (high/medium/low)', Security),
    ask_question('Capital Buffer (months)', CapStr), atom_number(CapStr, CapitalBuffer),
    ask_question('Unique Value Proposition? (yes/no)', UVP),
    ask_question('Local Trend (growing/stable/declining)', LocalTrend),

    % Run the engine
    run_inference(UnemploymentRate, BusinessType, ExpectedIncome, BreakEvenPoint, 
                  RentCostPct, CompetitorsCount, SameType, OnlineReviews, 
                  Seasonal, Backup, NearUni, Tourism, PopDensity, YouthRatio, 
                  AreaDev, NearTrans, Security, CapitalBuffer, UVP, LocalTrend, Results),
    
    % Display Results
    format('~n--- ANALYSIS COMPLETE ---~n'),
    format('Score: ~w/100~n', [Results.score]),
    format('Risk Level: ~w~n', [Results.risk_level]),
    writeln('Recommendations:'),
    forall(member(R, Results.recommendations), format('- ~w~n', [R])).

ask_question(Prompt, Value) :-
    format('~w: ', [Prompt]),
    read_line_to_string(user_input, String),
    atom_string(Value, String).